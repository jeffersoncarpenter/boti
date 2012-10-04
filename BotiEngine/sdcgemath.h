#pragma once

#include <cmath>
using namespace std;

template<typename T>
T Max(T a, T b)
{
	return (a + b + abs(b - a)) / (T) 2;
}

template<typename T>
T Min(T a, T b)
{
	return (a + b - abs(b - a)) / 2.0;
}

template<typename T>
T LinearInterpolate(T a, T b, double t)
{
	return a * (1.0 - t) + b * t;
}

template<typename T>
double GetProportion(T end1, T end2, T point)
{
	return (point - end1) / (end2 - end1);
}