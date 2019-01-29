#include <aho_corasick.h>
#include <aho_corasick_internals.h>

size_t computePosFromChar(char ch)
{
	return ch < 0 ? nChars + ch : ch;
}

//implemented only for testing purposes
std::string getWordFromTree(Node* currentNode, std::string word)
{
	for_each(word.begin(), word.end(), [&currentNode](const auto ch) {
		auto pos = computePosFromChar(ch);

		currentNode = currentNode->children[pos].get();
	});

	return currentNode->words.empty() ? "empty" : currentNode->words[0];
}

//implemented only for testing purposes
std::vector<std::string> getMatchedWordsFromTree(Node* currentNode, std::string word)
{
	for_each(word.begin(), word.end(), [&currentNode](const auto ch) {
		auto pos = computePosFromChar(ch);

		currentNode = currentNode->children[pos].get();
	});

	return currentNode->words;
}

void addWordToTree(Node* currentNode, std::string word)
{
	for_each(word.begin(), word.end(), [&currentNode](const auto ch) {
		auto pos = computePosFromChar(ch);

		if (nullptr == currentNode->children[pos])
		{
			currentNode->children[pos] = std::make_unique<Node>();
		}

		currentNode = currentNode->children[pos].get();
	});

	if (!word.empty())
	{
		currentNode->words.push_back(word);
	}
}

void assignFailNode(Node* root, Node* node,	size_t pos)
{
	Node* currentNode = node;

	while (root != currentNode)
	{
		currentNode = currentNode->failNode;
		if (nullptr != currentNode->children[pos])
		{
			node->children[pos]->failNode = currentNode->children[pos].get();
			currentNode = root;
		}
	}

	if (nullptr == node->children[pos]->failNode)
	{
		node->children[pos]->failNode = root;
	}

	Node* child = node->children[pos].get();

	child->words.insert(child->words.end(),
						child->failNode->words.begin(),
						child->failNode->words.end());
}

void linkFailNodes(Node* root)
{
	root->failNode = root;

	std::queue<Node*> q;

	std::for_each(root->children.begin(), root->children.end(), [&q, &root](auto& child) {
		if (nullptr != child)
		{
			child->failNode = root;
			q.push(child.get());
		}
	});

	while (!q.empty())
	{
		auto currentNode = q.front();
		q.pop();

		for (size_t i = 0; i < currentNode->children.size(); ++i)
		{
			if (nullptr != currentNode->children[i])
			{
				assignFailNode(root, currentNode, i);
				q.push(currentNode->children[i].get());
			}
		}
	}
}

std::vector<std::tuple<size_t, std::string>> findMatches(Node *root, std::string text)
{
	std::vector<std::tuple<size_t, std::string>> matches;

	Node* currentNode = root;

	for (size_t i = 0; i < text.length(); ++i)
	{
		auto pos = computePosFromChar(text[i]);

		while (nullptr == currentNode->children[pos] && currentNode != root)
		{
			currentNode = currentNode->failNode;
		}

		if (nullptr != currentNode->children[pos])
		{
			currentNode = currentNode->children[pos].get();

			for (const auto word : currentNode->words)
			{
				matches.push_back(std::make_tuple(i - word.length() + 1, word));
			}
		}
	}

	return matches;
}

std::unordered_map<std::string, std::string> createDictionary(std::string& dictionaryText) 
{
	std::unordered_map<std::string, std::string> dictionary;
	std::vector<size_t> delimPos;

	const char delimiter = '#';
	const char newLine = '\n';

	dictionaryText += '\n';

	for (size_t i = 0; i < dictionaryText.length(); ++i)
	{
		if (dictionaryText[i] == delimiter)
		{
			delimPos.push_back(i);
		}
		else if (dictionaryText[i] == newLine)
		{
			if (delimPos.size() == 4)
			{
				++delimPos[0];
				++delimPos[2];
				auto word = dictionaryText.substr(delimPos[0], delimPos[1] - delimPos[0]);
				auto replaceWord = dictionaryText.substr(delimPos[2], delimPos[3] - delimPos[2]);
			
				if (!word.empty())
				{
					dictionary[word] = replaceWord;
				}
			}
			delimPos.clear();
		}
	}

	return dictionary;
}

std::unique_ptr<Node> buildPrefixTree(std::unordered_map<std::string, std::string> dictionary)
{
	std::unique_ptr<Node> root = std::make_unique<Node>();
	std::for_each(dictionary.begin(), dictionary.end(), [&root](auto pair) {
		addWordToTree(root.get(), pair.first);
	});

	return root;
}

std::unordered_map<size_t, std::string> solveOverlappings(std::vector<std::tuple<size_t, std::string>> matches, size_t inputSize)
{
	std::vector<bool> mask(inputSize);
	std::unordered_map<size_t, std::string> selectedMatches;

	std::sort(matches.begin(), matches.end(), [](auto x, auto y) {
		return std::get<1>(x).length() > std::get<1>(y).length();
	});

	for (auto& match : matches)
	{
		auto start = std::get<0>(match);
		auto end = start + std::get<1>(match).length() - 1;
		if (mask[start] == false && mask[end] == false)
		{
			for (auto i = start; i <= end; ++i)
			{
				mask[i] = true;
			}

			selectedMatches[start] = std::get<1>(match);
		}
	}

	return selectedMatches;
}


std::string generateOutput(const std::string& inputText,
	std::unordered_map<std::string, std::string> dictionary,
	std::unordered_map<size_t, std::string> selectedMatches)
{
	std::string result = "";
	for (size_t i = 0; i < inputText.length(); ++i)
	{
		if (selectedMatches.find(i) != selectedMatches.end())
		{
			result.append(dictionary[selectedMatches[i]]);
			i += selectedMatches[i].length() - 1;
		}
		else
		{	
			if (inputText[i] != '\r')
			{
				result += inputText[i];
			}
		}
	}

	return result;
}

std::string translateFile(std::string& inputText, std::string& dictionaryText)
{
	auto dictionary = createDictionary(dictionaryText);
	auto root = buildPrefixTree(dictionary);
	linkFailNodes(root.get());

	auto matches = findMatches(root.get(), inputText);

	auto selectedMatches = solveOverlappings(matches, inputText.length());
	auto output = generateOutput(inputText, dictionary, selectedMatches);

	return output;
}

