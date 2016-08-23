function shuffle(array) {
    var current = array.length;
    var index;
    var aux;

    while(current) {
        index = Math.floor(Math.random() * current);
        current--;

        aux = array[current];
        array[current] = array[index];
        array[index] = aux;
    }

    return array;
}

module.exports = shuffle;
