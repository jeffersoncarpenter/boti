#include <linearAlgebra.h>

#include "stdafx.h"

using namespace System;
using namespace System::Text;
using namespace System::Collections::Generic;
using namespace	Microsoft::VisualStudio::TestTools::UnitTesting;

namespace TestBotiEngine
{
	[TestClass]
	public ref class TestPoint
	{
	public: 
		[TestMethod]
		void TestCreatePoint2()
		{
			Point point = Point(2);

			point[0] = 1.0;
			point[1] = 0.25;

			Assert::IsTrue(1.0 == point[0]);
			Assert::IsTrue(0.25 == point[1]);
		}
	};
}
