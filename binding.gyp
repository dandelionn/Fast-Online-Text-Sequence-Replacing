{
    "targets": [
        {
            "cflags": ["-Wall", "-std=c++17"],
            "include_dirs": [ "translator.h",
                "<!(node -e \"require('nan')\")"
            ],
            "target_name": "addon",
            "sources": [ "main.cpp", "translator.cpp" ]
        }
    ]
}