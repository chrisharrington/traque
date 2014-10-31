Number.prototype.pad = function(length, char) {
    if (length === undefined)
        length = 2;
    if (char === undefined)
        char = "0";
    return (char + this).slice(length * -1);
}