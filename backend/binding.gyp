{
    "targets": [
        {
            "cflags": ["-Wall", "-std=c++17"],
            "include_dirs": ["cpp",
                "<!(node -e \"require('nan')\")"
            ],
            "target_name": "addon",
            "sources": [ "cpp/main.cpp", "cpp/replace_words.cpp", "cpp/aho_corasick.cpp" ]
        }
    ]
}