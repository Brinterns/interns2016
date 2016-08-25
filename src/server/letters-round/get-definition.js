var fetch = require('isomorphic-fetch');

function getDefinition(word) {
    return fetch('https://glosbe.com/gapi/translate?from=eng&dest=eng&format=json&phrase=' + word + '&pretty=true')
            .then(response => {
                if (response.status >= 400) {
                    throw new Error('Fakkin Error m9');
                }
                return response.json();
            })
            .then(response => {
                return(response.tuc[0].meanings[0].text);
            })
            .catch(error => {
                console.Error(error);
            })
}

module.exports = getDefinition;
