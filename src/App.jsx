import React, { useState } from "react";

const ageGroups = [
    { id: 0, label: "0-3mo" },
    { id: 1, label: "3-12mo" },
    { id: 2, label: "1-12y" },
    { id: 3, label: "12-18y" },
];

//these save the fields for the respective age group sorted by id
const rangeChecks = {
    heartRate: [
        {min: 100, max: 185},
        {min: 95, max: 175},
        {min: 70, max: 145},
        {min: 50, max: 130},
    ],
    bloodPressure: [
        {min: 35, max: 100},
        {min: 35, max: 100},
        {min: 45, max: 120},
        {min: 55, max: 130},
    ],
    sodium: {min: 133, max: 145},
    potassium: {min: 3.5, max: 6.2},
};
const rangeVals = {
    heartRate: [11, 7],
    bloodPressure: [13, 2],
    sodium: [5,1],
    potassium: [3,3]
};
const thresholdChecks = {
    SpO_2: 148,
    PaO_2: 100,
    bilirubin: 5.9,
    wbcc: 2,
    bun: 68,
    serumBicarb: 15,
    temperature: 38.5,
};
const thresholdVals = {
    SpO_2: 11,
    PaO_2: 11,
    bilirubin: 9,
    wbcc: 12,
    bun: 10,
    serumBicarb: 6,
    temperature: 3,
    urinaryOutput: 11,
    diag: 29,
};

const PSAPSCALC = () => {
    // General state for numerical variables
    const [values, setValues] = useState({
        SpO_2: 0,
        PaO_2: 0,
        sodium: 0,
        potassium: 0,
        bilirubin: 0,
        wbcc: 0,
        bun: 0,
        serumBicarb: 0,
        temperature: 0,
        urinaryOutput: null,
        adType: null,
        diag: null,
        heartRate: 0,
        bloodPressure: 0,
    });
    // user input values that show up onscreen
    const [input, setInput] = useState({
        SpO_2: 0,
        PaO_2: 0,
        FiO_2: 0,
        sodium: 0,
        potassium: 0,
        bilirubin: 0,
        wbcc: 0,
        bun: 0,
        serumBicarb: 0,
        temperature: 0,
        urinaryOutput: 0,
        adType: 0,
        diag: 0,
        heartRate: 0,
        bloodPressure: 0,
    })

    const [activeField, setActiveField] = useState(""); // "SpO_2" or "PaO_2"

    const [selectedAge, setSelectedAge] = useState(null);

    const handleValueChange = (key, value) => {
        setValues((prev) => ({ ...prev, [key]: value }));
    };

    const handleAgeSelect = (ageId) => setSelectedAge(ageId);

    const totalScore = Object.values(values).reduce((acc, val) => acc + val, 0);

    // range based variables check
    const checkRange = (field, value, id) => {
        let bounds;
        value = value.trim();
        if(field === "heartRate" || field === "bloodPressure") {
            bounds = rangeChecks[field][id];
        } else bounds = rangeChecks[field];

        if (!bounds) return; // no rules for this field

        let input = NaN;
        if(value !== ""){
            input = Number(value);
        }
        else{
            setValues(prev => ({
                ...prev,
                [field]: 0
            }));
            setInput(prev => ({
                ...prev,
                [field]: value
            }));
            return; // reset the points to 0
        }

        if(!isNaN(input)) {
            let newValue = 0;

            if (input < bounds.min){
                newValue = rangeVals[field][0];  // only update this field
            } else if (input > bounds.max){
                newValue = rangeVals[field][1];  // only update this field
            }

            setValues(prev => ({
                ...prev,
                [field]: newValue
            }));
            setInput(prev => ({
                ...prev,
                [field]: value
            }));
        }
        else alert("please input a valid value");
    };

    // thresholds
    const checkUpperBound = (field, value) => {
        value = value.trim();
        if(value === ""){
            setInput(prev => ({
                ...prev,
                [field]: value
            }));
            return;
        }
        value = Number(value);
        if(isNaN(value)){
            alert("please input a valid value");
            return;
        }

        const bound = thresholdChecks[field];
        if (!bound) return;

        setInput(prev => ({
            ...prev,
            [field]: value
        }));

        if(value > bound){
            setValues(prev => ({
                ...prev,
                [field]: thresholdVals[field]
            }));
        }
    };

    const checkLowerBound = (field, value) => {
        value = value.trim();
        if(value === ""){
            setInput(prev => ({
                ...prev,
                [field]: value
            }));
            return;
        }
        value = Number(value);
        if(isNaN(value)){
            alert("please input a valid value");
            return;
        }

        const bound = thresholdChecks[field];
        if (!bound) return;

        setInput(prev => ({
            ...prev,
            [field]: value
        }));

        if(value < bound){
            setValues(prev => ({
                ...prev,
                [field]: thresholdVals[field]
            }));
        }
    };

    const checkRatio = (field, value) => {
        // Trim spaces
        value = value.trim();

        if (value === "") {
            setInput(prev => ({ ...prev, [field]: value }));
            return;
        }

        // Only allow numbers (integer or decimal)
        if (!/^\d*\.?\d*$/.test(value)) {
            alert("Please input a valid numeric value");
            return;
        }

        value = Number(value);
        if (isNaN(value)) {
            alert("Please input a valid numeric value");
            return;
        }

        // Prevent division by zero if FiO2 is empty or zero
        const FiO2 = Number(input.FiO_2);
        if (!FiO2 || FiO2 === 0) {
            setInput(prev => ({ ...prev, [field]: value }));
            return;
        }

        const ratio = value / FiO2;
        const bound = thresholdChecks[field];
        if (!bound) return;

        if (ratio < bound) {
            setValues(prev => ({ ...prev, [field]: thresholdVals[field] }));
        }
        else{
            setValues(prev => ({ ...prev, [field]: 0 }));
        }

        setInput(prev => ({ ...prev, [field]: value }));
    };



    return (
        <div className="flex justify-center items-center min-h-screen bg-green-200">
            <div className="w-full max-w-3xl p-6 space-y-4 bg-white shadow-lg rounded-2xl">
            <h1 className="text-3xl font-bold text-center">p-SAPS III Calculator</h1> <br></br>
            <h2 className="text-xl font-bold">Age dependent Variables (select to reveal)</h2>
            <div className="space-x-2">
                <span className="mr-2 font-bold">Age:</span>
                {ageGroups.map((age) => (
                    <button
                        key={age.id}
                        className={`btn ${selectedAge === age.id ? "btn-accent" : "btn-warning"}`}
                        onClick={() => {handleAgeSelect(age.id);
                        handleValueChange("heartRate", 0);
                        handleValueChange("bloodPressure", 0);
                        setInput(prev => ({ ...prev, heartRate: 0}));
                        setInput(prev => ({ ...prev, bloodPressure: 0 }));}}
                    >
                        {age.label}
                    </button>
                ))}
            </div>

            {selectedAge !== null && (
                <>
                    <div>
                        <span className="mr-2 font-bold">Heart Rate:</span>
                        <input
                            type="text"
                            value={input.heartRate}
                            onChange={(e) => checkRange("heartRate", e.target.value, selectedAge)}
                            className="input input-bordered"
                        />
                        <span> ({values.heartRate} points)</span>
                    </div>

                    <div>
                        <span className="mr-2 font-bold">Systolic Blood Pressure:</span>
                        <input
                            type="text"
                            value={input.bloodPressure} // assumes values.bloodPressure in state
                            onChange={(e) => checkRange("bloodPressure", e.target.value, selectedAge)}
                            className="input input-bordered"
                        />
                        <span> ({values.bloodPressure} points)</span>
                    </div>
                </>
            )}
            <br></br>

            <h2 className="text-xl font-bold">Age independent Variables</h2>
            <div className="space-y-4">
                {/* FiO2 is always visible */}
                <div>
                    <span className="mr-2 font-medium">FiO₂:</span>
                    <input
                        type="text"
                        value={input.FiO_2}
                        onChange={(e) => {
                            const value = e.target.value.trim(); // remove spaces

                            // Only alert if it's not empty and not a number
                            if (value !== "" && isNaN(Number(value))) {
                                alert("Please input a valid value");
                            } else {
                                setInput(prev => ({ ...prev, FiO_2: value }));
                            }

                            if(activeField === "SpO_2"){
                                checkRatio("SpO_2", input.SpO_2);
                            }
                            if(activeField === "PaO_2"){
                                checkRatio("PaO_2", input.PaO_2);
                            }
                        }}
                        className="input input-bordered"
                    />
                </div>

                {/* Checkboxes to toggle ratio input */}
                <div className="flex space-x-4">
                    <label>
                        SpO₂/FiO₂
                        <input
                            type="checkbox"
                            checked={activeField === "SpO_2"}
                            onChange={() =>
                                setActiveField((prev) => (prev === "SpO_2" ? "" : "SpO_2"))
                            }
                        />
                    </label>

                    <label>
                        PaO₂/FiO₂
                        <input
                            type="checkbox"
                            checked={activeField === "PaO_2"}
                            onChange={() =>
                                setActiveField((prev) => (prev === "PaO_2" ? "" : "PaO_2"))
                            }
                        />
                    </label>
                </div>

                {/* Conditional input fields */}
                {activeField === "SpO_2" && (
                    <div>
                        <span className="mr-2 font-medium">SpO₂:</span>
                        <input
                            type="text"
                            value={input.SpO_2}
                            onChange={(e) => {checkRatio("SpO_2", e.target.value)}}
                            className="input input-bordered"
                        /><br></br>
                        <span className="text-l font-bold">SpO₂/FiO₂: {isNaN(input.SpO_2/input.FiO_2) ? "-": input.SpO_2/input.FiO_2} </span>
                        <span> ({values.SpO_2} points)</span>
                    </div>
                )}

                {activeField === "PaO_2" && (
                    <div>
                        <span className="mr-2 font-medium">PaO₂:</span>
                        <input
                            type="text"
                            value={input.PaO_2}
                            onChange={(e) => {
                                checkRatio("PaO_2", e.target.value);
                            }
                            }
                            className="input input-bordered"
                        /><br></br>
                        <span className="text-l font-bold">PaO₂/FiO₂: {isNaN(input.PaO_2/input.FiO_2) ? "-": input.PaO_2/input.FiO_2} </span>
                        <span> ({values.PaO_2} points)</span>
                    </div>
                )}
            </div>

            <div>
                <span className="mr-2 font-bold">Sodium (mEq/L):</span>
                <input
                    type="text"
                    value={input.sodium}
                    onChange={(e) => checkRange("sodium", e.target.value, 0)}
                    className="input input-bordered"
                />
                <span> ({values.sodium} points)</span>
            </div>

            <div>
                <span className="mr-2 font-bold">Potassium (mEq/L):</span>
                <input
                    type="text"
                    value={input.potassium}
                    onChange={(e) => checkRange("potassium", e.target.value, 0)}
                    className="input input-bordered"
                />
                <span> ({values.potassium} points)</span>
            </div>

            <div>
                <span className="mr-2 font-bold">Bilirubin (mg/dL):</span>
                <input
                    type="text"
                    value={input.bilirubin}
                    onChange={(e) => checkUpperBound("bilirubin", e.target.value)}
                    className="input input-bordered"
                />
                <span> ({values.bilirubin} points)</span>
            </div>

            <div>
                <span className="mr-2 font-bold">White Blood Cell Count (10<sup>3</sup>/mm<sup>3</sup>):</span>
                <input
                    type="text"
                    value={input.wbcc}
                    onChange={(e) => checkLowerBound("wbcc", e.target.value)}
                    className="input input-bordered"
                />
                <span> ({values.wbcc} points)</span>
            </div>

            <div>
                <span className="mr-2 font-bold">BUN (mg/dl):</span>
                <input
                    type="text"
                    value={input.bun}
                    onChange={(e) => checkUpperBound("bun", e.target.value)}
                    className="input input-bordered"
                />
                <span> ({values.bun} points)</span>
            </div>

            <div>
                <span className="mr-2 font-bold">Serum bicarbonate (mEqu/L):</span>
                <input
                    type="text"
                    value={input.serumBicarb}
                    onChange={(e) => checkLowerBound("serumBicarb", e.target.value)}
                    className="input input-bordered"
                />
                <span> ({values.serumBicarb} points)</span>
            </div>

            <div>
                <span className="mr-2 font-bold">Temperature (C°):</span>
                <input
                    type="text"
                    value={input.temperature}
                    onChange={(e) => checkLowerBound("temperature", e.target.value)}
                    className="input input-bordered"
                />
                <span> ({values.temperature} points)</span>
            </div>
                <br></br>
                <div>
                <span className="mr-2 font-bold">Urinary Output: Anuria</span>
                <div className="space-x-2">
                    <button
                        className={`btn ${values.urinaryOutput === 11 ? "btn-accent" : "btn-warning"}`}
                        onClick={() => handleValueChange("urinaryOutput", 11)}
                    >
                        Yes
                    </button>
                    <button
                        className={`btn ${values.urinaryOutput === 0 ? "btn-accent" : "btn-warning"}`}
                        onClick={() => handleValueChange("urinaryOutput", 0)}
                    >
                        No
                    </button>
                    <span>({values.urinaryOutput ?? 0} points)</span>
                </div>
            </div>

            <div>
                <label className="font-bold">Type of admission:</label>
                <div className="space-x-2">
                    <button
                        className={`btn ${values.adType === 8 ? "btn-accent" : "btn-warning"}`}
                        onClick={() => handleValueChange("adType", 8)}
                    >
                        Unscheduled
                    </button>
                    <button
                        className={`btn ${values.adType === 0 ? "btn-accent" : "btn-warning"}`}
                        onClick={() => handleValueChange("adType", 0)}
                    >
                        Scheduled
                    </button>
                    <span>({values.adType ?? 0} points)</span>
                </div>
            </div>

            <div>
                <label className="font-bold">Primary diagnosis / reason for admission:</label>
                <div className="space-x-2">
                    <button
                        className={`btn ${values.diag === 29 ? "btn-accent" : "btn-warning"}`}
                        onClick={() => handleValueChange("diag", 29)}
                    >
                        * CPR / ICH / ECMO
                    </button>
                    <button
                        className={`btn ${values.diag === 0 ? "btn-accent" : "btn-warning"}`}
                        onClick={() => handleValueChange("diag", 0)}
                    >
                        Other
                    </button>
                    <span>({values.diag ?? 0} points)</span>
                </div>
            </div>

                <br></br>
                <h2 className="fixed bottom-6 right-6 text-4xl font-extrabold bg-white shadow-2xl rounded-2xl px-6 py-4">
                    Score: {totalScore}
                </h2>
                <p className="text-m ">
                    *
                    ICH = Intracranial hemorrhage in combination with coma
                    <br></br>
                    &nbsp;&nbsp;ECMO = Needed ECMO support within the first 24 hours since admission
                </p>
            </div>
        </div>
    );
};

export default PSAPSCALC;
