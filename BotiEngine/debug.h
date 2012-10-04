#ifdef ASSERT
#undef ASSERT
#endif

#ifdef DEBUG

#	include <iostream>
	using namespace std;

#	define ASSERT(condition) \
	if(!(condition)) \
	{ \
		cout << "Assertion failed: " << #condition << " at " << __FILE__ << ":" << __LINE__ << "\n"; \
	}
#	define WARN(message) cout << "Warn: " << message << " at " << __FILE__ << ":" << __LINE__ << "\n";

#else

#	define ASSERT(condition)
#	define WARN(message)

#endif