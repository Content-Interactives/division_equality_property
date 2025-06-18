import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { RefreshCw } from 'lucide-react';

const DivisionEqualityProperty = () => {
  const formatEquation = (equation) => {
    return equation
      .replace(/\//g, ' ÷ ') // Replace / with ÷ and add spaces
      .replace(/\s+/g, ' ') // Normalize spaces
      .replace(/\s*=\s*/g, ' = ') // Ensure spaces around equals
      .replace(/\s*÷\s*/g, ' ÷ ') // Ensure spaces around division
      .trim(); // Remove leading/trailing spaces
  };

  const generateProblem = () => {
    // Generate random coefficient (2-12 for reasonable difficulty)
    const coefficient = Math.floor(Math.random() * 11) + 2;
    // Generate random solution (2-9)
    const solution = Math.floor(Math.random() * 8) + 2;
    // Calculate the result
    const result = coefficient * solution;

    return {
      equation: `${coefficient}x = ${result}`,
      step1: `${coefficient}x ÷ ${coefficient} = ${result} ÷ ${coefficient}`,
      solution: solution.toString(),
      explanation: `First divide both sides by ${coefficient}: ${coefficient}x ÷ ${coefficient} = ${result} ÷ ${coefficient}, then simplify to get x = ${solution}`
    };
  };

  // State management
  const [currentProblem, setCurrentProblem] = useState(generateProblem());
  const [step1Answer, setStep1Answer] = useState('');
  const [step2Answer, setStep2Answer] = useState('');
  const [showSteps, setShowSteps] = useState(false);
  const [hasError, setHasError] = useState({
    step1: false,
    step2: false
  });
  const [completedSteps, setCompletedSteps] = useState({
    step1: false,
    step2: false
  });
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showNavigationButtons, setShowNavigationButtons] = useState(false);
  const [navigationDirection, setNavigationDirection] = useState(null);
  const [stepSkipped, setStepSkipped] = useState({
    step1: false,
    step2: false
  });

  const generateNewProblem = () => {
    setCurrentProblem(generateProblem());
    setStep1Answer('');
    setStep2Answer('');
    setShowSteps(false);
    setHasError({ step1: false, step2: false });
    setCompletedSteps({ step1: false, step2: false });
    setCurrentStepIndex(0);
    setShowNavigationButtons(false);
    setNavigationDirection(null);
    setStepSkipped({ step1: false, step2: false });
  };

  const checkAnswer = (step, answer) => {
    // Normalize the input and expected answer
    const normalizeEquation = (eq) => {
      return eq
        .replace(/\s+/g, '') // Remove all whitespace
        .replace(/\//g, '÷') // Convert / to ÷
        .toLowerCase();
    };

    if (step === 1) {
      const normalizedInput = normalizeEquation(answer);
      const normalizedExpected = normalizeEquation(currentProblem.step1);
      
      const isCorrect = normalizedInput === normalizedExpected;
      setHasError(prev => ({ ...prev, step1: !isCorrect }));
      if (isCorrect) {
        setCompletedSteps(prev => ({ ...prev, step1: true }));
        setStepSkipped(prev => ({ ...prev, step1: false }));
      }
      return isCorrect;
    } else if (step === 2) {
      const normalizedInput = normalizeEquation(answer);
      const normalizedExpected = normalizeEquation(`x=${currentProblem.solution}`);
      
      const isCorrect = normalizedInput === normalizedExpected;
      setHasError(prev => ({ ...prev, step2: !isCorrect }));
      if (isCorrect) {
        setCompletedSteps(prev => ({ ...prev, step2: true }));
        setStepSkipped(prev => ({ ...prev, step2: false }));
      }
      return isCorrect;
    }
  };

  const skipStep = (step) => {
    if (step === 1) {
      setStep1Answer(currentProblem.step1);
      setCompletedSteps(prev => ({ ...prev, step1: true }));
      setStepSkipped(prev => ({ ...prev, step1: true }));
    } else if (step === 2) {
      setStep2Answer(`x=${currentProblem.solution}`);
      setCompletedSteps(prev => ({ ...prev, step2: true }));
      setStepSkipped(prev => ({ ...prev, step2: true }));
    }
  };

  const handleNavigateHistory = (direction) => {
    setNavigationDirection(direction);
    
    if (direction === 'back' && currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    } else if (direction === 'forward' && currentStepIndex < 1) {
      setCurrentStepIndex(prev => prev + 1);
    }

    setTimeout(() => {
      setNavigationDirection(null);
    }, 300);
  };

  React.useEffect(() => {
    if (completedSteps.step1 && completedSteps.step2) {
      setShowNavigationButtons(true);
    }
  }, [completedSteps.step1, completedSteps.step2]);

  return (
    <>
      <style>{`
        @property --r {
          syntax: '<angle>';
          inherits: false;
          initial-value: 0deg;
        }

        .glow-button { 
          min-width: auto; 
          height: auto; 
          position: relative; 
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1;
          transition: all .3s ease;
          padding: 7px;
        }

        .glow-button::before {
          content: "";
          display: block;
          position: absolute;
          background: #fff;
          inset: 2px;
          border-radius: 4px;
          z-index: -2;
        }

        .simple-glow {
          background: conic-gradient(
            from var(--r),
            transparent 0%,
            rgb(0, 255, 132) 2%,
            rgb(0, 214, 111) 8%,
            rgb(0, 174, 90) 12%,
            rgb(0, 133, 69) 14%,
            transparent 15%
          );
          animation: rotating 3s linear infinite;
          transition: animation 0.3s ease;
        }

        .simple-glow.stopped {
          animation: none;
          background: none;
        }

        @keyframes rotating {
          0% {
            --r: 0deg;
          }
          100% {
            --r: 360deg;
          }
        }

        .nav-button {
          opacity: 1;
          cursor: default !important;
          position: relative;
          z-index: 2;
          outline: 2px white solid;
        }

        .nav-button-orbit {
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          background: conic-gradient(
            from var(--r),
            transparent 0%,
            rgb(0, 255, 132) 2%,
            rgb(0, 214, 111) 8%,
            rgb(0, 174, 90) 12%,
            rgb(0, 133, 69) 14%,
            transparent 15%
          );
          animation: rotating 3s linear infinite;
          z-index: 0;
        }

        .nav-button-orbit::before {
          content: "";
          position: absolute;
          inset: 2px;
          background: transparent;
          border-radius: 50%;
          z-index: 0;
        }

        .nav-button svg {
          position: relative;
          z-index: 1;
        }
      `}</style>
      <div className="w-[500px] h-auto mx-auto shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.05)] bg-white rounded-lg overflow-hidden">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[#5750E3] text-sm font-medium select-none">Division Property</h2>
            <Button 
              onClick={generateNewProblem}
              className="bg-[#008545] hover:bg-[#00703d] text-white px-4 h-[32px] flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              New Problem
            </Button>
          </div>

          <div className="text-center text-xl mb-4">
            <span className="font-mono">{currentProblem.equation}</span>
          </div>

          <div className={`glow-button ${showSteps ? 'simple-glow stopped' : 'simple-glow'}`}>
            <Button 
              onClick={() => setShowSteps(true)}
              className="w-full bg-[#008545] hover:bg-[#00703d] text-white py-2 rounded"
            >
              Solve Step by Step
            </Button>
          </div>
        </div>

        {showSteps && (
          <div className="bg-gray-50">
            <div className="p-4 space-y-4">
              <div className="w-full p-2 mb-1 bg-white border border-[#5750E3]/30 rounded-md">
                {currentStepIndex === 0 && (
                  <>
                    <p className="text-sm mb-2">Step 1: Divide both sides by the coefficient</p>
                    <div className="space-y-2">
                      {!completedSteps.step1 ? (
                        <>
                          <div className={`flex items-center border rounded-md overflow-hidden relative ${
                            hasError.step1 ? 'border-yellow-500' : ''
                          }`}>
                            <Input 
                              type="text"
                              value={step1Answer}
                              onChange={(e) => {
                                setStep1Answer(e.target.value);
                                setHasError(prev => ({ ...prev, step1: false }));
                              }}
                              placeholder="e.g., 4x ÷ 4 = 20 ÷ 4"
                              className="w-full border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                          </div>
                          <div className="flex gap-2 justify-end">
                            <div className="glow-button simple-glow">
                              <div className="flex gap-2">
                                <Button
                                  onClick={() => checkAnswer(1, step1Answer)}
                                  className="bg-[#008545] hover:bg-[#00703d] text-white text-sm px-4 py-2 rounded-md"
                                >
                                  Check
                                </Button>
                                <Button
                                  onClick={() => skipStep(1)}
                                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm px-4 py-2 rounded-md"
                                >
                                  Skip
                                </Button>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center mb-4">
                            <span className="font-medium text-[#008545]">
                              {formatEquation(step1Answer)}
                            </span>
                          </div>
                          {!showNavigationButtons && (
                            <div className="flex justify-end items-center gap-2">
                              {!stepSkipped.step1 && (
                                <span className="text-green-600 font-medium">Great Job!</span>
                              )}
                              <div className="glow-button simple-glow">
                                <Button
                                  onClick={() => setCurrentStepIndex(1)}
                                  className="bg-[#008545] hover:bg-[#00703d] text-white text-sm px-4 py-2 rounded-md"
                                >
                                  Continue
                                </Button>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </>
                )}

                {currentStepIndex === 1 && completedSteps.step1 && (
                  <>
                    <p className="text-sm mb-2">Step 2: Write the final answer</p>
                    <div className="space-y-2">
                      {!completedSteps.step2 ? (
                        <>
                          <div className={`flex items-center border rounded-md overflow-hidden relative ${
                            hasError.step2 ? 'border-yellow-500' : ''
                          }`}>
                            <Input 
                              type="text"
                              value={step2Answer}
                              onChange={(e) => {
                                setStep2Answer(e.target.value);
                                setHasError(prev => ({ ...prev, step2: false }));
                              }}
                              placeholder="e.g., x = 5"
                              className="w-full border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                          </div>
                          <div className="flex gap-2 justify-end">
                            <div className="glow-button simple-glow">
                              <div className="flex gap-2">
                                <Button
                                  onClick={() => checkAnswer(2, step2Answer)}
                                  className="bg-[#008545] hover:bg-[#00703d] text-white text-sm px-4 py-2 rounded-md"
                                >
                                  Check
                                </Button>
                                <Button
                                  onClick={() => skipStep(2)}
                                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm px-4 py-2 rounded-md"
                                >
                                  Skip
                                </Button>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center mb-4">
                            <span className="font-medium text-[#008545]">
                              {formatEquation(step2Answer)}
                            </span>
                          </div>
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                            <h3 className="text-green-800 text-xl font-bold">Great Work!</h3>
                            <p className="text-green-700">
                              You've successfully solved the equation using the division property!
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>

              <div className="flex items-center justify-center gap-2 mt-4">
                <div
                  className="nav-orbit-wrapper"
                  style={{
                    position: 'relative',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    visibility: showNavigationButtons && currentStepIndex > 0 ? 'visible' : 'hidden',
                    opacity: showNavigationButtons && currentStepIndex > 0 ? 1 : 0,
                    pointerEvents: showNavigationButtons && currentStepIndex > 0 ? 'auto' : 'none',
                    transition: 'opacity 0.2s ease',
                  }}
                >
                  <div className="nav-button-orbit"></div>
                  <div style={{ position: 'absolute', width: '32px', height: '32px', borderRadius: '50%', background: 'white', zIndex: 1 }}></div>
                  <button
                    onClick={() => handleNavigateHistory('back')}
                    className={`nav-button w-8 h-8 flex items-center justify-center rounded-full bg-[#008545]/20 text-[#008545] hover:bg-[#008545]/30 relative z-50`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 18l-6-6 6-6"/>
                    </svg>
                  </button>
                </div>
                <span className="text-sm text-gray-500 min-w-[100px] text-center">
                  Step {currentStepIndex + 1} of 2
                </span>
                <div
                  className="nav-orbit-wrapper"
                  style={{
                    position: 'relative',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    visibility: showNavigationButtons && currentStepIndex < 1 ? 'visible' : 'hidden',
                    opacity: showNavigationButtons && currentStepIndex < 1 ? 1 : 0,
                    pointerEvents: showNavigationButtons && currentStepIndex < 1 ? 'auto' : 'none',
                    transition: 'opacity 0.2s ease',
                  }}
                >
                  <div className="nav-button-orbit"></div>
                  <div style={{ position: 'absolute', width: '32px', height: '32px', borderRadius: '50%', background: 'white', zIndex: 1 }}></div>
                  <button
                    onClick={() => handleNavigateHistory('forward')}
                    className={`nav-button w-8 h-8 flex items-center justify-center rounded-full bg-[#008545]/20 text-[#008545] hover:bg-[#008545]/30 relative z-50`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 18l6-6-6-6"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DivisionEqualityProperty;