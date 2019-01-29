#include <fstream>
#include <string>
#include <vector>
#include <chrono>

#include "translator.h"
#include "modern.h"
#include "aho_corasick.h"


std::string readFile(const std::string &fileName)
{
	std::ifstream ifs(fileName.c_str(), std::ios::in | std::ios::binary | std::ios::ate);

	std::ifstream::pos_type fileSize = ifs.tellg();
	ifs.seekg(0, std::ios::beg);

	std::vector<char> bytes(fileSize);
	ifs.read(&bytes[0], fileSize);

	return std::string(&bytes[0], fileSize);
}

void outputToFile(const std::string& fileName, const std::string& output)
{
	std::ofstream fout(fileName);
	fout << output;
}

std::string ProccessInput(std::string dictionaryFile, std::string inputFile, std::string outputFile)
{
    auto start = std::chrono::system_clock::now();

	std::string inputText = readFile(inputFile);
	std::string dictionaryText = readFile(dictionaryFile);
	std::string output = translateFile(inputText, dictionaryText);
    


	outputToFile(outputFile, output);
    
    auto end = std::chrono::system_clock::now();
    std::chrono::duration<double> elapsed_seconds = end - start;
    
    return std::to_string(elapsed_seconds.count());
}