import React, { useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { RefreshCw } from 'lucide-react';

const DivisionEqualityProperty = () => {
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
  const [feedback, setFeedback] = useState('');
  const [showSteps, setShowSteps] = useState(false);
  const [hasError, setHasError] = useState({
    step1: false,
    step2: false
  });
  const [completedSteps, setCompletedSteps] = useState({
    step1: false,
    step2: false
  });

  const generateNewProblem = () => {
    setCurrentProblem(generateProblem());
    setStep1Answer('');
    setStep2Answer('');
    setFeedback('');
    setShowSteps(false);
    setHasError({ step1: false, step2: false });
    setCompletedSteps({ step1: false, step2: false });
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
      }
      return isCorrect;
    } else if (step === 2) {
      const normalizedInput = normalizeEquation(answer);
      const normalizedExpected = normalizeEquation(`x=${currentProblem.solution}`);
      
      const isCorrect = normalizedInput === normalizedExpected;
      setHasError(prev => ({ ...prev, step2: !isCorrect }));
      if (isCorrect) {
        setCompletedSteps(prev => ({ ...prev, step2: true }));
      }
      return isCorrect;
    }
  };

  const skipStep = (step) => {
    setCompletedSteps(prev => ({ ...prev, [`step${step}`]: true }));
  };

  return (
    <div className="bg-gray-100 p-8 w-full max-w-4xl mx-auto">
      <Card className="w-full shadow-md bg-white">
        <div className="bg-sky-50 p-6 rounded-t-lg">
          <h1 className="text-sky-900 text-2xl font-bold">Division Property of Equality</h1>
          <p className="text-sky-800">Learn how to solve equations using division!</p>
        </div>

        <CardContent className="space-y-6 pt-6">
          <div className="bg-blue-50 p-4 rounded border border-blue-200">
            <h2 className="text-blue-900 font-bold mb-2">What is the Division Property?</h2>
            <p className="text-blue-600">
              When you divide both sides of an equation by the same non-zero number,
              the equation remains equal. In other words, if a = b, then a ÷ c = b ÷ c
              (where c ≠ 0). This property helps us solve equations by isolating variables!
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-bold mb-4">Example</h2>
            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <p className="text-lg mt-8 mb-4">Given: 4x = 20</p>
                  <div>
                    <p className="font-medium">Step 1: To isolate x, divide both sides by 4</p>
                    <div className="p-4 my-2">4x ÷ 4 = 20 ÷ 4</div>
                  </div>
                  <div>
                    <p className="font-medium">Step 2: Write the final answer</p>
                    <div className="p-4 mb-2">x = 5</div>
                  </div>
                  <div className="mt-2 pt-4 border-t">
                    <p className="text-gray-700">
                      After dividing both sides by the same number, the two sides remain equal.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-purple-900 font-bold">Practice Time!</h2>
              <Button 
                onClick={generateNewProblem}
                className="bg-sky-500 hover:bg-sky-600 text-white px-4 flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                New Problem
              </Button>
            </div>

            <div className="text-center text-2xl mb-4">
              <span className="font-mono">{currentProblem.equation}</span>
            </div>

            <Button 
              onClick={() => setShowSteps(true)}
              className="w-full bg-blue-950 hover:bg-blue-900 text-white py-3"
            >
              Solve Step by Step
            </Button>

            {showSteps && (
              <div className="bg-purple-50 p-4 rounded-lg mt-4">
                <p className="mb-4">1. Isolate x by dividing both sides:</p>
                {completedSteps.step1 ? (
                  <p className="text-green-600 font-bold mb-2">{currentProblem.step1}</p>
                ) : (
                  <div className="flex items-center gap-4 mb-2">
                    <Input 
                      type="text"
                      value={step1Answer}
                      onChange={(e) => {
                        setStep1Answer(e.target.value);
                        setHasError(prev => ({ ...prev, step1: false }));
                      }}
                      placeholder="e.g., 4x ÷ 4 = 20 ÷ 4"
                      className={`flex-1 ${hasError.step1 ? 'border-red-500' : 'border-blue-300'}`}
                    />
                    <div className="flex gap-4">
                      <Button
                        onClick={() => checkAnswer(1, step1Answer)}
                        className="bg-blue-400 hover:bg-blue-500"
                      >
                        Check
                      </Button>
                      <Button
                        onClick={() => skipStep(1)}
                        className="bg-gray-400 hover:bg-gray-500 text-white"
                      >
                        Skip
                      </Button>
                    </div>
                  </div>
                )}

                {completedSteps.step1 && (
                  <div className="pt-4">
                    <p className="mb-4">2. Write the final answer:</p>
                    {completedSteps.step2 ? (
                      <>
                        <p className="text-green-600 font-bold mb-6">x = {currentProblem.solution}</p>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                          <h3 className="text-green-800 text-xl font-bold">Great Work!</h3>
                          <p className="text-green-700">
                            You've successfully solved the equation using the division property!
                          </p>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center gap-4 mb-6">
                        <Input 
                          type="text"
                          value={step2Answer}
                          onChange={(e) => {
                            setStep2Answer(e.target.value);
                            setHasError(prev => ({ ...prev, step2: false }));
                          }}
                          placeholder="e.g., x = 5"
                          className={`flex-1 ${hasError.step2 ? 'border-red-500' : 'border-blue-300'}`}
                        />
                        <div className="flex gap-4">
                          <Button
                            onClick={() => checkAnswer(2, step2Answer)}
                            className="bg-blue-400 hover:bg-blue-500"
                          >
                            Check
                          </Button>
                          <Button
                            onClick={() => skipStep(2)}
                            className="bg-gray-400 hover:bg-gray-500 text-white"
                          >
                            Skip
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      <p className="text-center text-gray-600 mt-4">
        Understanding the division property is key to solving equations!
      </p>
    </div>
  );
};

export default DivisionEqualityProperty;