{
    "targets": [
        {
            "cflags": ["-Wall", "-std=c++17"],
            "include_dirs": ["cpp/replace_words.h", "cpp/aho_corasick.h", "cpp/pch.h", "cpp/aho_corasick_internals.h",
                "<!(node -e \"require('nan')\")"
            ],
            "target_name": "addon",
            "sources": [ "cpp/main.cpp", "cpp/replace_words.cpp", "cpp/aho_corasick.cpp" ]
        }
    ]
}