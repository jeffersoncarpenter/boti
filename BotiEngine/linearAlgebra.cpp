#include "linearAlgebra.h"

#include "stdafx.h"

Double::Double()
{
	value = new double;
	*value = 0;
	ownValue = true;
}

Double::Double(const Double & op2)
{
	value = op2.value;
	ownValue = false;
}

Double::~Double()
{
	if(ownValue)
	{
		delete value;
	}
}

double Double::operator=(double op2)
{
	*value = op2;
	return op2;
}

Double::operator double()
{
	return *value;
}

DoubleArray::DoubleArray(
	int size,
	Double* (*initializeFunc)(int index),
	void (*deleteFunc)(Double* object)) : Array(size, initializeFunc, deleteFunc)
{
}

DoubleArray::~DoubleArray()
{
}