#pragma once

#include "IIO.h"

#include <iostream>
using namespace std;

class Sdcge
{
	IInput * iInput;
	IVideo * iVideo;
	ISound * iSound;
	ITimer * iTimer;
public:
	Sdcge();
	~Sdcge();
};