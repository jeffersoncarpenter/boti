#include "IIO.h"

#include "stdafx.h"

#include <GL/freeglut.h>

GlutAbstraction::GlutAbstraction()
{
	// set up glut
	char * argv[1];
	int argc = 1;
	argv[0] = "sdc";
	glutInit(&argc, argv);
	glutInitDisplayMode(GLUT_DEPTH | GLUT_DOUBLE | GLUT_RGBA);
	glutInitWindowPosition(100, 100);
	glutInitWindowSize(320, 320);
	glutCreateWindow("Boti");

	glutDisplayFunc(Draw);
	glutTimerFunc(0, DrawTimer, 0);

	glutTimerFunc(0, StepTimer, 0);

	// set up gl
	glClearColor(0.0, 0.0, 0.0, 1.0);
}

#pragma region IVideo

int GlutAbstraction::DrawFuncCallsPerSecond = 60;

void GlutAbstraction::SetDrawFunc(void (*drawFunc)())
{
	DrawFunc = drawFunc;
}

void (*GlutAbstraction::DrawFunc)() = [](){};

void GlutAbstraction::Draw()
{
	DrawFunc();
}

void GlutAbstraction::DrawTimer(int frame)
{
	glutPostRedisplay();
	glutTimerFunc(1000 / DrawFuncCallsPerSecond, DrawTimer, frame + 1);
}

#pragma endregion

#pragma region ITimer

int GlutAbstraction::StepFuncCallsPerSecond = 60;

void GlutAbstraction::SetStepFunc(void (*stepFunc)())
{
	StepFunc = stepFunc;
}

void (*GlutAbstraction::StepFunc)() = [](){};

void GlutAbstraction::StepTimer(int index)
{
	StepFunc();
	glutTimerFunc(1000 / StepFuncCallsPerSecond, StepTimer, index + 1);
}

#pragma endregion