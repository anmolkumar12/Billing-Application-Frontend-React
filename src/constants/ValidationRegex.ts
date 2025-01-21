export const ValidationRegex = {
     phoneCode:{
        pattern: /^\+[1-9][0-9]{1,4}$/,
        patternHint: 'start with + followed by 2 to 5 num digits (eg. +91, +12345).'
    },
    onlyCharacters: {
        pattern: /^[A-Za-z ]+$/,
        patternHint: 'Only letters (A-Z, a-z)'
    },
    
    website: {
        pattern: /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}(\/[a-zA-Z0-9#]+\/?)*$/,
        patternHint: 'Must be valid website(eg. https://www.example.com)'
    },
    alphanumeric: {
        pattern: /^[a-zA-Z0-9 ]+$/,
        patternHint: 'Must contain only letters or numbers'
    }
    
    
    
    
}