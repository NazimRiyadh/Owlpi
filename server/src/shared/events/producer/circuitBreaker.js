export const circuitState = Object.freeze({
    CLOSED: "CLOSED",
    OPEN: "OPEN",
    HALF_OPEN: "HALF_OPEN",
});

export class CircuitBreaker {
    constructor(opts = {}) {
        this.failureThreshold = opts.failureThreshold || 5;
        this.coolDownMs = opts.coolDownMs || 10000;
        this.halfOpenMaxAttempts = opts.halfOpenMaxAttempts || 3;
        this.logger = opts.logger || console;

        this._state = circuitState.CLOSED;
        this._failures = 0;
        this._lastFailureTime = 0;
        this._halfOpenAttempts = 0;
        this._halfOpenSuccess = 0;
    }

    _coolDownElapsed() {
        return Date.now() - this._lastFailureTime >= this.coolDownMs;
    }

    _transitionTo(newState) {
        const prev = this._state;
        this._state = newState;

        if (newState === circuitState.HALF_OPEN) {
            this._halfOpenAttempts = 0;
            this._halfOpenSuccess = 0;
            this.logger.info(`Circuit Breaker ${prev} → HALF_OPEN`);
        }
    }

    _openCircuit() {
        this._lastFailureTime = Date.now();
        this._transitionTo(circuitState.OPEN);
        this.logger.error("Circuit Breaker OPENED - No more requests allowed", {
            failures: this._failures,
            coolDownMs: this.coolDownMs,
        });
    }

    _reset() {
        this._state = circuitState.CLOSED;
        this._failures = 0;
        this._halfOpenAttempts = 0;
        this._halfOpenSuccess = 0;
        this.logger.info("Circuit Breaker RESET to CLOSED");
    }

    get state() {
        if (this._state === circuitState.OPEN && this._coolDownElapsed()) {
            this._transitionTo(circuitState.HALF_OPEN);
        }
        return this._state;
    }

    allowRequest() {
        const currentState = this.state; // ← getter is called

        if (currentState === circuitState.CLOSED) {
            return true;
        }

        if (currentState === circuitState.OPEN) {
            return false;
        }

        // HALF_OPEN
        if (this._halfOpenAttempts < this.halfOpenMaxAttempts) {
            this._halfOpenAttempts++;
            return true;
        }
        return false;
    }

    onSuccess() {
        const currentState = this.state; // ← Use getter (triggers transition if needed)

        if (currentState === circuitState.HALF_OPEN) {
            this._halfOpenSuccess++;

            if (this._halfOpenSuccess >= this.halfOpenMaxAttempts) {
                this._reset();
                this.logger.info(
                    "Circuit Breaker HALF_OPEN → CLOSED (success threshold met)",
                );
            }
            return;
        }

        // Success in CLOSED state
        if (this._failures > 0) {
            this._failures = 0;
            this.logger.info("Circuit Breaker failure count reset");
        }
    }

    onFailure() {
        const currentState = this.state; // ←  getter is called

        if (currentState === circuitState.HALF_OPEN) {
            this.logger.warn(
                "Circuit Breaker HALF_OPEN → OPEN (failure during probe)",
            );
            this._openCircuit();
            return;
        }

        this._failures++;
        this._lastFailureTime = Date.now();

        if (this._failures >= this.failureThreshold) {
            this.logger.error(
                `Circuit Breaker CLOSED → OPEN (failure threshold reached: ${this._failures})`,
            );
            this._openCircuit();
        }
    }

    snapshot() {
        return {
            state: this._state,
            failures: this._failures,
            halfOpenAttempts: this._halfOpenAttempts,
            halfOpenSuccess: this._halfOpenSuccess,
            lastFailureTime: this._lastFailureTime,
            failureThreshold: this.failureThreshold,
            coolDownMs: this.coolDownMs,
            halfOpenMaxAttempts: this.halfOpenMaxAttempts,
        };
    }
}
