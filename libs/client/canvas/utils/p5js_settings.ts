import { p5InstanceExtensions } from "p5";
import OptionsSet from "./options_set";

class P5JsSettings {
    static optionsSet: OptionsSet;
    static applySettings(
        p5: p5InstanceExtensions,
        newSettings: { [key: string]: any }
    ) {
        this.setSeed(p5, this.optionsSet.settings.seed);
        p5.noiseDetail(
            this.optionsSet.settings.noise_octaves,
            this.optionsSet.settings.noise_falloff
        );
    }

    static optionsMetadata(p5: p5InstanceExtensions) {
        return [
            {
                name: "seed",
                type: "integer",
                default: Math.round(p5.random(1000)),
            },
            { name: "noise_octaves", type: "integer", default: 10 },
            { name: "noise_falloff", type: "float", default: 0.6 },
        ];
    }

    static init(p5: p5InstanceExtensions) {
        this.optionsSet = new OptionsSet(this.optionsMetadata(p5));
        this.applySettings(p5, this.optionsSet.settings);
        this.logSettings();
    }

    static logSettings() {
        console.log("P5JS Settings: ");
        console.log(this.optionsSet.settings);
    }

    // static addDatGui(p5: p5InstanceExtensions, datGuiParams) {
    //     datGuiParams = datGuiParams || {};
    //     const datGui = new dat.gui.GUI(datGuiParams);

    //     if (datGuiParams.autoPlace === false) {
    //         this.datGuiContainer = this.createDatGuiContainer();
    //         this.datGuiContainer.appendChild(datGui.domElement);

    //         document.addEventListener("keyup", function (event) {
    //             if (event.key === "h") {
    //                 P5JsSettings.toggleDatGuiHide();
    //             }
    //         });
    //     }
    //     return datGui;
    // }

    // static toggleDatGuiHide() {
    //     if (this.datGuiContainer.style.display === "none") {
    //         this.datGuiContainer.style.display = "block";
    //     } else {
    //         this.datGuiContainer.style.display = "none";
    //     }
    // }

    static createDatGuiContainer() {
        let container = document.createElement("div");
        container.setAttribute("id", "datGuiContainer");
        container.style.position = "absolute";
        container.style.right = "0px";
        container.style.bottom = "20px";

        let label = document.createElement("div");
        label.style.color = "white";
        label.style.backgroundColor = "black";
        label.style.padding = "5px";
        label.style.font = "11px 'Lucida Grande',sans-serif";
        label.innerHTML = "Config (Press H to Hide/Show)";
        container.appendChild(label);

        document.body.appendChild(container);
        return container;
    }

    static setSeed(p5: p5InstanceExtensions, seed: number) {
        this.optionsSet.settings.seed = seed;
        p5.randomSeed(this.optionsSet.settings.seed);
        p5.noiseSeed(this.optionsSet.settings.seed);
    }

    static getSeed() {
        return this.optionsSet.settings.seed;
    }
}

export default P5JsSettings;
