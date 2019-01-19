
#include "translator.h"

#include <nan.h>
#include <string>

// NAN_METHOD is a Nan macro enabling convenient way of creating native node functions.
// It takes a method's name as a param. By C++ convention, I used the Capital cased name.

/*
NAN_METHOD(Hello) {
    // Create an instance of V8's String type
    auto message = Nan::New("Hello from C++!").ToLocalChecked();
    // 'info' is a macro's "implicit" parameter - it's a bridge object between C++ and JavaScript runtimes
    // You would use info to both extract the parameters passed to a function as well as set the return value.
    info.GetReturnValue().Set(message);
}*/

NAN_METHOD(TranslateFile) 
{
    if (info.Length() != 3)
    {
        return Nan::ThrowError("Invalid number of arguments");  
    }

    //The Nan::Utf8String api both validates strings internally and is fast. It has an optimized conversion routine similar to node core. And it works across all recent node versions.

    Nan::Utf8String arg0(info[0]); //utf8 value
    Nan::Utf8String arg1(info[1]);
    Nan::Utf8String arg2(info[2]);
    
    if(arg0.length() <= 0 || arg1.length() <= 0 || arg2.length() <=0 ) 
    {
        return Nan::ThrowTypeError("arg must be a non-empty string");
    }

    std::string dictionaryPath(*arg0, arg0.length()); 
    std::string inputPath(*arg1, arg1.length());
    std::string outputPath(*arg2, arg2.length());

    std::string result = ProccessInput(dictionaryPath, inputPath, outputPath);

    auto message = Nan::New(result).ToLocalChecked();
    //auto message = Nan::New("Done").ToLocalChecked();

    info.GetReturnValue().Set(message);
}

// Module initialization logic
NAN_MODULE_INIT(Initialize) {
    // Export the `Hello` function (equivalent to `export function Hello (...)` in JS)
    NAN_EXPORT(target, TranslateFile);
}

// Create the module called "addon" and initialize it with `Initialize` function (created with NAN_MODULE_INIT macro)
NODE_MODULE(addon, Initialize);