package com.ticketrush.exception;

public class SeatAlreadyTakenException extends RuntimeException {
    public SeatAlreadyTakenException() {
        super("This seat is already taken by another user");
    }

    public SeatAlreadyTakenException(String message) {
        super(message);
    }
}
