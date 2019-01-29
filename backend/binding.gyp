{
    "targets": [
        {
            "cflags": ["-Wall", "-std=c++17"],
            "include_dirs": ["cpp/modern.h", "cpp/translator.h", "cpp/aho_corasick.h", "cpp/pch.h", "cpp/aho_corasick_internals.h",
                "<!(node -e \"require('nan')\")"
            ],
            "target_name": "addon",
            "sources": [ "cpp/main.cpp", "cpp/translator.cpp", "cpp/modern.cpp", "cpp/aho_corasick.cpp" ]
        }
    ]
}