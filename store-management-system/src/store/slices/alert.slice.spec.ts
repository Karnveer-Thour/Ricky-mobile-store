import alertReducer, { SUCCESSALERT, ERRORALERT, CLOSEALERT } from './alert.slice';
import { alertType } from '@/types/alert.index';
import { describe, it, expect } from 'vitest';

describe('Alert Redux Slice Reducer', () => {
  const initialState = {
    type: null,
    message: null,
    id: null,
  };

  it('should return initial state by default', () => {
    expect(alertReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle SUCCESSALERT action correctly', () => {
    const messagePayload = 'Operation completed successfully!';
    const nextState = alertReducer(initialState, SUCCESSALERT(messagePayload));

    expect(nextState.type).toBe(alertType.success);
    expect(nextState.message).toBe(messagePayload);
    expect(nextState.id).toBeTypeOf('number');
  });

  it('should handle ERRORALERT action correctly', () => {
    const errorPayload = 'An unexpected error occurred.';
    const nextState = alertReducer(initialState, ERRORALERT(errorPayload));

    expect(nextState.type).toBe(alertType.error);
    expect(nextState.message).toBe(errorPayload);
    expect(nextState.id).toBeTypeOf('number');
  });

  it('should handle CLOSEALERT action correctly', () => {
    const activeState = {
      type: alertType.success,
      message: 'Active Alert Message',
      id: 123456789,
    };
    const nextState = alertReducer(activeState, CLOSEALERT(null));

    expect(nextState.type).toBeNull();
    expect(nextState.message).toBeNull();
  });
});
