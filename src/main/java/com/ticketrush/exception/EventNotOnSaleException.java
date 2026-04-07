package com.ticketrush.exception;

public class EventNotOnSaleException extends RuntimeException {
    public EventNotOnSaleException() {
        super("This event is not currently on sale");
    }

    public EventNotOnSaleException(String message) {
        super(message);
    }
}
