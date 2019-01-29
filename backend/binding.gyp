{
    "targets": [
        {
            "cflags": ["-Wall", "-std=c++17"],
            "include_dirs": ["cpp/modern.h", "cpp/translator.h", 
                "<!(node -e \"require('nan')\")"
            ],
            "target_name": "addon",
            "sources": [ "cpp/main.cpp", "cpp/translator.cpp", "cpp/modern.cpp" ]
        }
    ]
}