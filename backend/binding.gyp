{
    "targets": [
        {
            "cflags": ["-Wall", "-std=c++17"],
            "include_dirs": ["modern.h", "translator.h", 
                "<!(node -e \"require('nan')\")"
            ],
            "target_name": "addon",
            "sources": [ "main.cpp", "translator.cpp", "modern.cpp" ]
        }
    ]
}