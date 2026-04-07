package com.ticketrush.exception;

public class QueueAccessDeniedException extends RuntimeException {
    public QueueAccessDeniedException() {
        super("You do not have access to book seats. Please wait in the queue.");
    }

    public QueueAccessDeniedException(String message) {
        super(message);
    }
}
