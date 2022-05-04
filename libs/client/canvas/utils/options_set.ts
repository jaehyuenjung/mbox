import UtilFunctions from "./util_funtions";

export interface Option {
    name: string;
    type: string;
    default: number;
    delimiter?: string;
}

export type OptionsMetadata = Option[];

class OptionsSet {
    optionsMeta: OptionsMetadata;
    settingsHash: { [key: string]: any };
    constructor(optionsMeta: OptionsMetadata) {
        this.optionsMeta = optionsMeta;
        this.settingsHash = {};
        this.init();
    }

    get optionsMetadata() {
        return this.optionsMeta;
    }

    defaultSettings() {
        let defaultValues: { [key: string]: number } = {};
        for (let option of this.optionsMetadata) {
            defaultValues[option.name] = option.default;
        }
        return defaultValues;
    }

    readParamOptions() {
        let paramOptions: { [key: string]: any } = {};
        for (let option of this.optionsMetadata) {
            if (this.isArrayType(option.type)) {
                paramOptions[option.name] = this.getArray(option);
            } else {
                paramOptions[option.name] = UtilFunctions.getParameterByName(
                    option.name,
                    this.formatterForType(option.type)
                );
            }
        }
        return paramOptions;
    }

    formatterForType(type: string) {
        return {
            integer: parseInt,
            float: Number,
            string: undefined,
        }[type];
    }

    isArrayType(type: string) {
        return type.startsWith("array");
    }

    getArray(option: Option) {
        let full_param = UtilFunctions.getParameterByName(option.name);
        if (!full_param) return null;

        let results = full_param.split(option.delimiter || ",");

        let type = option.type.split(":")[1];
        let formatter = this.formatterForType(type);
        if (formatter) {
            results = results.map((val: any) => formatter!(val));
        }
        return results;
    }

    init() {
        let paramOptions = this.readParamOptions();
        UtilFunctions.unsetUndefineds(paramOptions);

        Object.assign(this.settingsHash, this.defaultSettings(), paramOptions);
    }

    get settings() {
        return this.settingsHash;
    }

    logSettings() {
        console.log("Settings: ");
        console.log(this.settingsHash);
    }
}

export default OptionsSet;
