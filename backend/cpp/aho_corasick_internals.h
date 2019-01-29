#include "pch.h"

constexpr int nChars = 256;

struct Node {
	Node() : children(nChars), failNode(nullptr){}
	std::vector<std::unique_ptr<Node>> children;
	std::vector<std::string> words;
	Node* failNode;
};

size_t computePosFromChar(char ch);

std::string getWordFromTree(Node* currentNode, std::string word);

std::vector<std::string> getMatchedWordsFromTree(Node* currentNode, std::string word);

void addWordToTree(Node* currentNode, std::string word);

std::unordered_map<std::string, std::string> createDictionary(std::string& dictionaryText);

std::unique_ptr<Node> buildPrefixTree(std::unordered_map<std::string, std::string> dictionary);

std::vector<std::tuple<size_t, std::string>> findMatches(Node *root, std::string text);

std::unordered_map<size_t, std::string> solveOverlappings(std::vector<std::tuple<size_t, std::string>> matches, size_t inputSize);

void assignFailNode(Node* root, Node* node, size_t pos);

void linkFailNodes(Node* root);

std::string generateOutput(const std::string& inputText,
	std::unordered_map<std::string, std::string> dictionary,
	std::unordered_map<size_t, std::string> selectedMatches);


