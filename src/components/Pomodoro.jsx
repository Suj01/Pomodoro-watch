import { Box, Button, Center, Flex, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Text, VStack, CircularProgress, CircularProgressLabel } from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";

const Pomodoro = () => {
    const [workTime, setWorkTime] = useState(25);
    const [breakTime, setBreakTime] = useState(5);
    const [sliderWorkTime, setSliderWorkTime] = useState(25);
    const [sliderBreakTime, setSliderBreakTime] = useState(5);
    const [isRunning, setIsRunning] = useState(false);
    const [isWorkSession, setIsWorkSession] = useState(true);
    const [secondsLeft, setSecondsLeft] = useState(workTime * 60);
    const [progress, setProgress] = useState(100);
    const intervalRef = useRef(null);

    const getProgressColor = () => {
        if (secondsLeft <= 300) return "red.400";
        if (secondsLeft <= 600) return "yellow.400";
        return isWorkSession ? "green.400" : "blue.400";
    };

    useEffect(() => {
        setSecondsLeft(isWorkSession ? workTime * 60 : breakTime * 60);
        setProgress(100);
    }, [workTime, breakTime, isWorkSession]);

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setSecondsLeft(prev => {
                    if (prev === 1) {
                        clearInterval(intervalRef.current);
                        setIsWorkSession(!isWorkSession);
                        setIsRunning(false);
                        return 0;
                    }
                    return prev - 1;
                });
                setProgress((secondsLeft / (isWorkSession ? workTime * 60 : breakTime * 60)) * 100);
            }, 1000);
        }

        return () => clearInterval(intervalRef.current);
    }, [isRunning, isWorkSession, workTime, breakTime, secondsLeft]);

    const handleStart = () => {
        setIsRunning(true);
    };

    const handleStop = () => {
        setIsRunning(false);
        clearInterval(intervalRef.current);
    };

    const handleReset = () => {
        setIsRunning(false);
        clearInterval(intervalRef.current);
        setWorkTime(25);
        setBreakTime(5);
        setSliderWorkTime(25);
        setSliderBreakTime(5);
        setSecondsLeft(25 * 60);
        setProgress(100);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <Center flexDirection="column" height="100vh">
            <Box>
                <CircularProgress
                    value={progress}
                    size="250px"
                    thickness="6px"
                    color={getProgressColor()}
                    trackColor="gray.200"
                    transition="all 0.5s ease-out"
                    animation="pulse 2s infinite"
                >
                    <CircularProgressLabel fontSize="48px" fontWeight="bold">
                        {formatTime(secondsLeft)}
                    </CircularProgressLabel>
                </CircularProgress>

                <VStack spacing={4} mt={10}>
                    <Flex gap={4}>
                        <Button colorScheme="green" onClick={handleStart}>Start</Button>
                        <Button colorScheme="yellow" onClick={handleStop}>Stop</Button>
                        <Button colorScheme="red" onClick={handleReset}>Reset</Button>
                    </Flex>

                    <Box mt={10} w="80%">
                        <Text fontWeight="bold">Work Time: {sliderWorkTime} minutes</Text>
                        <Slider value={sliderWorkTime} min={1} max={60} step={1} onChange={(val) => { setSliderWorkTime(val); setWorkTime(val); }}>
                            <SliderTrack bg="gray.100">
                                <SliderFilledTrack bg="green.400" />
                            </SliderTrack>
                            <SliderThumb boxSize={6}>
                                <Box color="green.400" as="span" />
                            </SliderThumb>
                        </Slider>

                        <Text fontWeight="bold" mt={4}>Break Time: {sliderBreakTime} minutes</Text>
                        <Slider value={sliderBreakTime} min={1} max={30} step={1} onChange={(val) => { setSliderBreakTime(val); setBreakTime(val); }}>
                            <SliderTrack bg="gray.100">
                                <SliderFilledTrack bg="blue.400" />
                            </SliderTrack>
                            <SliderThumb boxSize={6}>
                                <Box color="blue.400" as="span" />
                            </SliderThumb>
                        </Slider>
                    </Box>
                </VStack>
            </Box>
        </Center>
    );
};

export default Pomodoro;
