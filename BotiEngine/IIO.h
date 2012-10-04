#pragma once

class IInput
{
public:
};

class IVideo
{
public:
	virtual void SetDrawFunc(void (*drawFunc)()) = 0;
};

class ISound
{
public:
};

class ITimer
{
public:
	virtual void SetStepFunc(void (*stepFunc)()) = 0;
};

class GlutAbstraction : public IInput, public IVideo, public ITimer
{
public:
	GlutAbstraction();

	// IInput

	// IVideo
	static int DrawFuncCallsPerSecond;
	virtual void SetDrawFunc(void (*drawFunc)());

	// ITimer
	static int StepFuncCallsPerSecond;
	virtual void SetStepFunc(void (*stepFunc)());
private:
	// IInput

	// IVideo
	static void (*DrawFunc)(); // lambda called by Draw()
	static void Draw(); // glut's draw callback
	static void DrawTimer(int frame); // a timer that gets Glut to call Draw

	// ITimer
	static void (*StepFunc)(); // lambda called by StepTimer
	static void StepTimer(int index); // a timer
};