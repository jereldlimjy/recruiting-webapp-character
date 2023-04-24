import { useEffect, useMemo, useState } from 'react';
import './App.css';
import { ATTRIBUTE_LIST, CLASS_LIST, SKILL_LIST } from './consts.js';


function App() {
  // Attribute points
  const [attributePoints, setAttributePoints] = useState(ATTRIBUTE_LIST.reduce((acc, currAttribute) => (
    { ...acc, [currAttribute]: 0 }
  ), {}));

  // Total attribute points
  const [totalAttributePoints, setTotalAttributePoints] = useState(0);
  
  // Class requirement met
  const [classReqMet, setClassReqMet] = useState(Object.keys(CLASS_LIST).reduce((acc, currClass) => (
    { ...acc, [currClass]: false }
  ), {}));

  // Show class minimum requirements
  const [showMinReq, setShowMinReq] = useState(Object.keys(CLASS_LIST).reduce((acc, currClass) => (
    { ...acc, [currClass]: false }
  ), {}));

  // Total skill points available
  const skillPointsAvailable = useMemo(() => {
    return getSkillPointsAvailable();

    // eslint-disable-next-line
  }, [attributePoints["Intelligence"]]);

  // Skill points used
  const [skillPointsUsed, setSkillPointsUsed] = useState(0);

  // Skill points
  const [skillPoints, setSkillPoints] = useState(SKILL_LIST.reduce((acc, currSkillObj) => (
    { ...acc, [currSkillObj.name]: 0 }
  ), {}));

  useEffect(() => {
    const newClassReqMet = {};

    Object.entries(CLASS_LIST).forEach(([className, minAttributeObj]) => {
      const isMinMet = ATTRIBUTE_LIST.every((attribute) => attributePoints[attribute] >= minAttributeObj[attribute]);
      newClassReqMet[className] = isMinMet;
    });

    setClassReqMet(newClassReqMet);
  }, [attributePoints]);

  const handleAttributeAdd = (attribute) => {
    if (totalAttributePoints >= 70) {
      alert("A Character can have up to 70 delegated Attribute Points");
      return;
    } 

    setAttributePoints((prevState) => ({
      ...prevState,
      [attribute]: prevState[attribute]++,
    }));
    setTotalAttributePoints(totalAttributePoints + 1);
  };

  const handleAttributeSub = (attribute) => {
    if (attributePoints[attribute] === 0) return;

    setAttributePoints((prevState) => ({
      ...prevState,
      [attribute]: prevState[attribute]--,
    }));
    setTotalAttributePoints(totalAttributePoints - 1);
  };

  const handleShowMinReq = (className) => {
    setShowMinReq((prevState) => ({
      ...prevState,
      [className]: !prevState[className],
    }))
  };

  const handleSkillAdd = (skill) => {
    if (skillPointsUsed >= skillPointsAvailable) {
      alert("You have no skill points to allocate");
      return;
    };

    setSkillPoints((prevState) => ({
      ...prevState,
      [skill]: prevState[skill]++,
    }))

    setSkillPointsUsed(skillPointsUsed + 1);
  }

  const handleSkillSub = (skill) => {
    if (skillPoints[skill] === 0) return;

    setSkillPoints((prevState) => ({
      ...prevState,
      [skill]: prevState[skill]--,
    }))

    setSkillPointsUsed(skillPointsUsed - 1);
  }

  // Declared this way for function hoisting
  function getModifier(points) {
    return Math.floor((points - 10) / 2);
  };

  function getSkillPointsAvailable() {
    return Math.max(0, 10 + (4 * getModifier(attributePoints["Intelligence"])));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>React Coding Exercise - Jereld Lim</h1>
      </header>

      {/* Attributes */}
      <section className="App-section">
        <h2 style={{ color: "lightgreen" }}>Attributes</h2>

        {ATTRIBUTE_LIST.map((attribute, id) => (
          <div key={id} style={{ marginBottom: "6px" }}>
            <label>
              {attribute}: <strong>{attributePoints[attribute]}</strong>
              {" "}
              (Modifier: {getModifier(attributePoints[attribute])})
            </label>
            <button value={attribute} style={{ marginLeft: "8px" }} onClick={(e) => handleAttributeAdd(e.target.value)}>+</button>
            <button value={attribute} style={{ marginLeft: "4px" }} onClick={(e) => handleAttributeSub(e.target.value)}>-</button>
          </div>
        ))}
      </section>

      {/* Classes */}
      <section className="App-section">
        <h2 style={{ color: "red" }}>Classes</h2>
        
        {Object.entries(CLASS_LIST).map(([className, minAttributeObj], id) => (
          <div key={id}>
            <h3 style={{ color: !!classReqMet[className] ? "green" : "", cursor: "pointer" }} onClick={() => handleShowMinReq(className)}>{className}</h3>
            {showMinReq[className] &&
              <div>
                <h4>Minimum Requirements:</h4>
                {Object.entries(minAttributeObj).map(([attribute, minStat], id) => (
                  <p key={id}>{attribute}: {minStat}</p>
                ))}
                <p style={{ color: "red" }}>(Click on class again to close)</p>
              </div>}
          </div>
        ))}
      </section>

      {/* Skills */}
      <section className="App-section">
        <h2 style={{ color: "orange" }}>Skills</h2>

        <p>
          <strong>Total skill points available: {skillPointsAvailable}</strong>
        </p>

        {SKILL_LIST.map((skillObj, id) => (
          <div key={id}>
            <p>
              <label>
                {skillObj.name} - Points: {skillPoints[skillObj.name]}
              </label>
              <button value={skillObj.name} style={{ marginLeft: "4px" }} onClick={(e) => handleSkillAdd(e.target.value)}>+</button>
              <button value={skillObj.name} style={{ marginLeft: "4px" }} onClick={(e) => handleSkillSub(e.target.value)}>-</button>
              {" "}
              Modifier ({skillObj.attributeModifier}): {getModifier(attributePoints[skillObj.attributeModifier])}
              {" "}
              Total: <strong>{skillPoints[skillObj.name] + getModifier(attributePoints[skillObj.attributeModifier])}</strong>
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}

export default App;
