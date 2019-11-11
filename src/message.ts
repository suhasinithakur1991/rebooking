export function validMessage(type: any, min?: number, max?: number) {
  return {
    language: {
      string: {
        base: '!!Please enter a valid ' + type + '.',
        allowOnly: '!!Please select a valid ' + type + '.',
        email: '!!Please enter a valid email.',
        min: '!!'+ type +' length should be minimum ' + min + ' characters.',
        max: '!!'+ type +' length should not be greater than ' + max + ' characters.',
      },
      number: {
        base: '!!Please enter a valid ' + type + '.',
        allowOnly: '!!Please select a valid ' + type + '.',
        min: '!!Minimum number of '+ type +' allowed are ' + min + '.',
        max: '!!Maximum number of '+ type +' allowed are ' + max + '.',
      },
      boolean: {
        base: '!!Please enter a valid ' + type + '.',
        allowOnly: '!!Please select a valid ' + type + '.',
      },
      any: {
        allowOnly: '!!Please select a valid ' + type + '.',
        required: '!!' + type + ' is required.',
      },
    },
  };
}

export class Messages {
    public static NOT_ALLOWED: string = 'Not allowed';
    public static NOT_AUTHORISED: string = 'User is not authorized';
    public static NOT_LOGGED_IN: string = 'User not loggedin.';
    public static SUCCESSFULLY_FETCHED: string = 'Successfully Fetched';
    public static BOOKINGS_NOT_FOUND: string = 'Bookings Not Found';
    public static NOT_ALLOWED_FOR_FLIGHTS: string = 'This API is not supported for flights';
    
    public static BUS_BOOKINGS_NOT_FOUND: string = 'Bus bookings not found'
    public static USER_BUS_BOOKINGS_NOT_FOUND: string = 'No Bus Booking found for provided userId';
}
