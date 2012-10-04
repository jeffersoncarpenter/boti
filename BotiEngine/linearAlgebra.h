#pragma once

class Double
{
public:
	double * value;
	bool ownValue;

	Double();
	Double(const Double & op2);
	~Double();

	double operator=(double op2);
	operator double();
};

template<typename T>
class Array
{
	int size;
	T ** list;
public:
	int GetSize() { return size; }

	void Walk(T* (*transformFunc)(T* object))
	{
		for(int i = 0; i < size; i++)
		{
			list[i] = transformFunc(list[i]);
		}
	}

	Array(int size, T* (*initializeFunc)(int index), void (*deleteFunc)(T* object))
	{
		this->size = size;
		list = new T* [size];

		Walk([](T* object) {
			return new T();
		});
	}
	virtual ~Array()
	{
		delete [] list;
	}

	T operator[](int index)
	{
		return *list[index];
	}
};

class DoubleArray : public Array<Double>
{
public:
	DoubleArray(
		int size,
		Double* (*initializeFunc)(int index) = [](int index){
			return new Double();
		},
		void (*deleteFunc)(Double* object) = [](Double* object){
			delete object;
		});

	~DoubleArray();
}; 

class DoubleArray2D : public Array<Array<Double>>
{
};

class Point : public DoubleArray
{
public:
	Point(int size) : DoubleArray(size)
	{
	}

	virtual ~Point() {}
};