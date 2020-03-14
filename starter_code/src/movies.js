/* eslint no-restricted-globals: 'off' */
"use strict";

/*
activitat5-all-time-movies
Carlos Sousa
14-March-2020
*/

// Turn duration of the movies from hours to minutes
// Returns the array with the same structure but with property 'duration' as a number
function turnHoursToMinutes(array) {
    return array.map(x => {
        const y = Object.assign({}, x); // shallow copy
        const duration = x.duration;
        if (typeof duration === "string") {
            // parse string
            y.duration = +duration.replace(/^(?:\s*(\d+)\s*h)?(?:\s*(\d+)\s*min)?\s*$/i,
                (match, p1, p2) => p1 ? (p2 ? p1 * 60 + p2 * 1 : p1 * 60) : (p2 ? +p2 : undefined));
        } else if (typeof duration === "number" && isFinite(duration)) {
            //already a number, so must be the duration in minutes
            y.duration = duration;
        } else {
            y.duration = undefined;
        }
        return y;
    });
}

// Get the average of all rates with 2 decimals

function ratesAverage(array) {
    const len = array.length;
    if (len > 0) { // Rounding to two decimal places (pitfalls, ex: 1.005...)
        return Math.round(100 * array
            .map(x => {
                const rate = x.rate;
                if (typeof rate === "number" && isFinite(rate)) {
                    return parseFloat(rate);
                } else if (typeof rate === "string") {
                    return rate.match(/^[+-]?\d+\.?\d*|[+-]?\.\d+$/) ? parseFloat(rate) : 0;
                } else {
                    return undefined;
                }
            })
            .reduce((total, n) => total + n) / len) / 100;
    } else {
        return undefined;
    }
}

// Get the average of Drama Movies
// Case insensitive

function dramaMoviesRate(array) {
    if (array.length > 0) {
        return ratesAverage(array.filter(x => x.genre.some(x => x.toUpperCase() === 'DRAMA')));
    } else {
        return undefined;
    }
}

// Log the output
console.log(dramaMoviesRate(movies));

// Order by time duration, in growing order
// Sorts alphabetically in case of movies with same duration
// Case insensitive

function orderByDuration(array) {
    if (array.length > 0) {
        return turnHoursToMinutes(array).sort(
            (a, b) => {
                if (a.duration === b.duration) { // sort alphabetically
                    return a.title.localeCompare(b.title, 'en', { sensitivity: 'base' });
                } else { // sort ascending order
                    return a.duration - b.duration;
                }
            });
    } else {
        return undefined;
    }
}

// How many movies did STEVEN SPIELBERG
// Case insensitive

function howManyMovies(array) {
    if (array.length > 0) {
        const numDramaSpberg = array
            .filter(x => x.genre.some(x => x.toUpperCase() === 'DRAMA'))
            .filter(x => x.director.toUpperCase() === 'STEVEN SPIELBERG')
            .length;
        return `Steven Spielberg directed ${numDramaSpberg} drama movies!`;
    } else {
        return undefined;
    }
}

// Order by title and print the first 20 titles

function orderAlphabetically(array) {
    if (array.length > 0) {
        return array
            .map(x => x.title)
            .sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }))
            .slice(0, 20);
    } else {
        return [];
    }
}

// Best yearly rate average

function bestYearAvg(array) {
    if (array.length > 0) {
        let out = [];
        let index = 0;
        for (let movie of array) {
            index = out.findIndex(x => x.year === movie.year);
            if (index >= 0) {
                out[index].rates.push({ rate: movie.rate });
            } else {
                out.push({ year: movie.year, rates: [{ rate: movie.rate }] });
            }
        }
        const result = out
            .map(movieYear => [movieYear.year, ratesAverage(movieYear.rates)])
            .reduce((max, rate) => {
                if (rate[1] > max[1]) { return rate; }
                if (rate[1] < max[1]) { return max; }
                if (rate[0] < max[0]) { return rate; }
                return max;
            });
        return `The best year was ${result[0]} with an average rate of ${result[1]}`;
    } else {
        return undefined;
    }
}