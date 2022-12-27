/**
 * A string containing a time in a speedrun-context-friendly way.
 * @typedef {(string)} timeString
 */

/**
 * Class to deal with timeStrings in speedrunning contexts.
 */
class SpeedrunTime {
    /**
     * 
     * @param {number} inputHours 
     * @param {number} inputMinutes 
     * @param {number} inputSeconds 
     * @param {number} inputMilliseconds 
     * @param {string} inputSign 
     * @param {string} inputPlayer 
     * @returns SpeedrunTimeString object
     */
    constructor(inputHours = 0, inputMinutes = 0, inputSeconds = 0, inputMilliseconds = 0, inputSign = "+", inputPlayer = undefined) {
        // Inputs !== "number"
        if (typeof inputMilliseconds !== "number") throw new Error("TypeError: inputMilliseconds has to be of type 'int'");
        if (typeof inputSeconds !== "number") throw new Error("TypeError: inputSeconds has to be of type 'int'");
        if (typeof inputMinutes !== "number") throw new Error("TypeError: inputMinutes has to be of type 'int'");
        if (typeof inputHours !== "number") throw new Error("TypeError: inputHours has to be of type 'int'");
        // Inputs too large
        if (inputMilliseconds > 999) throw new Error("There can't be over 999 milliseconds.");
        if (inputSeconds > 59) throw new Error("There can't be over 59 seconds.");
        if (inputMinutes > 59) throw new Error("There can't be over 59 minutes.");
        // Inputs too small
        if (inputHours<0) throw new Error("Hours have to be Ints bigger or equal to 0!");
        if (inputMinutes<0) throw new Error("Minutes have to be Ints bigger or equal to 0!");
        if (inputSeconds<0) throw new Error("Seconds have to be Ints bigger or equal to 0!");
        if (inputMilliseconds<0) throw new Error("Milliseconds have to be Ints bigger or equal to 0!");
        // Sign check
        if (!["+","-"].includes(inputSign)) throw new Error("Sign has to be '-' or '+'") 
        // Code
        this.hours = inputHours;
        this.minutes = inputMinutes;
        this.seconds = inputSeconds;
        this.milliseconds = inputMilliseconds;
        this.player = inputPlayer;
        this.sign = inputSign;
        /**
         * @param {string} stringType can be: "colon", "quote", "text"
         */
        this.timeString = function(stringType = "colon"){
            if (stringType==="colon") return `${this.hours.toString().padStart(2,"0")}:${this.minutes.toString().padStart(2,"0")}:${this.seconds.toString().padStart(2,"0")}.${this.milliseconds.toString().padStart(3,"0")}`;
            else if (stringType==="quote") return `${this.hours.toString().padStart(2,"0")}'${this.minutes.toString().padStart(2,"0")}'${this.seconds.toString().padStart(2,"0")}"${this.milliseconds.toString().padStart(3,"0")}`;
            else if (stringType==="text") return `${this.hours.toString().padStart(2,"0")}h ${this.minutes.toString().padStart(2,"0")}m ${this.seconds.toString().padStart(2,"0")}s ${this.milliseconds.toString().padStart(3,"0")}ms`;
            else throw new Error(`Unknown format '${stringType}'`);
        }
    };
}

/**
 * 
 * @param {timeString} timeString 
 * @returns SpeedrunTime Object from string
 */
function timeStringToSpeedrunTime(timeString){
    if (typeof timeString !== "string") throw new Error("TypeError: timeString has to be of type 'string'");
    let sign = "+"
    let hours = 0;
    let minutes = 0;
    let seconds = 0;
    let milliseconds = 0;
    if (["+","-"].includes(timeString.substring(0,1))){
        if (timeString.substring(0,1)==="+") timeString = timeString.substring(1);
        else if (timeString.substring(0,1)==="-") {
            timeString = timeString.substring(1);
            sign = "-";
        }
    }
    let splitByColon;
    let splitByDot;
    if (timeString.includes(":")) {
        splitByColon = timeString.split(":")
        if (splitByColon.length===3){
            hours = parseInt(splitByColon[0]);
            splitByColon.splice(0,1);
        }
        minutes = parseInt(splitByColon[0]);
    }
    if (timeString.includes(".")) {
        splitByDot = timeString.split(".")
        milliseconds = parseInt(splitByDot[splitByDot.length-1].padEnd(3,"0"));
    }
    if (timeString.includes(":")&&timeString.includes(".")) seconds = parseInt(splitByColon[splitByColon.length-1].split(".")[0]);
    else if (!timeString.includes(":")&&timeString.includes(".")) seconds = parseInt(splitByDot[0]);
    else if (timeString.includes(":")&&!timeString.includes(".")) seconds = parseInt(splitByColon[splitByColon.length-1]);
    else if (!timeString.includes(":")&&!timeString.includes(".")) seconds = timeString;
    return new SpeedrunTime(hours,minutes,seconds,milliseconds,sign)
}

/**
 * @param {Array<SpeedrunTime>} SpeedrunTimeArray
 */
function sumSpeedrunTimes(SpeedrunTimeArray){
    let hours = 0;
    let minutes = 0;
    let seconds = 0;
    let milliseconds = 0;
    for (let SpeedrunTime of SpeedrunTimeArray){
        if (SpeedrunTime.sign === "+") {
            hours += SpeedrunTime.hours;
            minutes += SpeedrunTime.minutes;
            seconds += SpeedrunTime.seconds;
            milliseconds += SpeedrunTime.milliseconds;
        }
        else if (SpeedrunTime.sign === "-") {
            hours -= SpeedrunTime.hours;
            minutes -= SpeedrunTime.minutes;
            seconds -= SpeedrunTime.seconds;
            milliseconds -= SpeedrunTime.milliseconds;
        }
    }
    if (milliseconds>999) {
        let extra = Math.floor(milliseconds/1000);
        seconds += extra;
        milliseconds -= 1000*extra;
    }
    if (seconds>59) {
        let extra = Math.floor(seconds/60);
        minutes += extra;
        seconds -= 60*extra;
    }
    if (minutes>59) {
        let extra = Math.floor(minutes/60);
        hours += extra;
        minutes -= 60*extra;
    }
    return new SpeedrunTime(hours,minutes,seconds,milliseconds);
};

/**
 * @param {Array<SpeedrunTime>} SpeedrunTimeArray
 */
function sortSpeedrunTimes(SpeedrunTimeArray){

}