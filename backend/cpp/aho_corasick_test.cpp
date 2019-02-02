#include <gtest/gtest.h>
#include <gmock/gmock.h>
#include "aho_corasick.h"
#include "aho_corasick_internals.h"

using namespace std;

using ::testing::ContainerEq;

TEST(AhoCorasick, computePosFromChar_MinimumAsciiCode)
{
	size_t result = computePosFromChar((char)0);
	size_t expected = 0;

	EXPECT_EQ(expected, result);
}

TEST(AhoCorasick, computePosFromChar_MaximumAsciiCode)
{
	size_t result = computePosFromChar((char)127);
	size_t expected = 127;

	EXPECT_EQ(expected, result);
}

TEST(AhoCorasick, computePosFromChar_MinimumExtendedAsciiCode)
{
	size_t result = computePosFromChar((char)128);
	size_t expected = 128;

	EXPECT_EQ(expected, result);
}

TEST(AhoCorasick, computePosFromChar_MaximumExtendedAsciiCode)
{
	size_t result = computePosFromChar((char)255);
	size_t expected = 255;

	EXPECT_EQ(expected, result);
}

TEST(AhoCorasick, addWordToTree_StringOfAsciiCodes)
{
	std::unique_ptr<Node> root = std::make_unique<Node>();

	addWordToTree(root.get(), "word");
	std::string result = getWordFromTree(root.get(), "word");
	std::string expected = "word";

	EXPECT_EQ(expected, result);
}

TEST(AhoCorasick, addWordToTree_StringWithExtendedAsciiCodes)
{
	std::unique_ptr<Node> root = make_unique<Node>();

	string word = (char) 128 + "€æ¶wordü€" + (char)255;

	addWordToTree(root.get(), word);
	std::string result = getWordFromTree(root.get(), word);

	EXPECT_EQ(word, result);
}

TEST(AhoCorasick, addWordToTree_EmptyString)
{
	std::unique_ptr<Node> root = make_unique<Node>();

	addWordToTree(root.get(), "");
	std::string result = getWordFromTree(root.get(), "");
	std::string expected = "empty";

	EXPECT_EQ(expected, result);
}

TEST(AhoCorasick, createDictionary_simpleTextDictionary)
{
	std::string dictionaryTest = "#aaa# #bbbb#\n#ccc##ddd#";
	auto dictionary = createDictionary(dictionaryTest);

	auto result = dictionary["aaa"] == "bbbb" &&
				  dictionary["ccc"] == "ddd"  &&
				  dictionary.size() == 2;

	EXPECT_TRUE(result);
}

TEST(AhoCorasick, createDictionary_TextDictionaryWithExtraNewLineAtTheEnd)
{
	std::string dictionaryTest = "#aaa# #bbbb#\n#ccc##ddd#\n";
	auto dictionary = createDictionary(dictionaryTest);

	auto result = dictionary["aaa"] == "bbbb" &&
		dictionary["ccc"] == "ddd"  &&
		dictionary.size() == 2;

	EXPECT_TRUE(result);
}

TEST(AhoCorasick, createDictionary_TextDictionaryWithExtraNewLineAtTheBeginning)
{
	std::string dictionaryTest = "\n#aaa# #bbbb#\n#ccc##ddd#";
	auto dictionary = createDictionary(dictionaryTest);

	auto result = dictionary["aaa"] == "bbbb" &&
		dictionary["ccc"] == "ddd"  &&
		dictionary.size() == 2;

	EXPECT_TRUE(result);
}

TEST(AhoCorasick, createDictionary_TextDictionaryWithWrongFormatAtTheEnd)
{
	std::string dictionaryTest = "#aaa# #bbbb#\n#ccc##ddd#\nextra characters";
	auto dictionary = createDictionary(dictionaryTest);

	auto result = dictionary["aaa"] == "bbbb" &&
		dictionary["ccc"] == "ddd"  &&
		dictionary.size() == 2;

	EXPECT_TRUE(result);
}

TEST(AhoCorasick, createDictionary_TextDictionaryWithWrongFormatAtTheBeginning)
{
	std::string dictionaryTest = "extra characters\n#aaa# #bbbb#\n#ccc##ddd#\n";
	auto dictionary = createDictionary(dictionaryTest);

	auto result = dictionary["aaa"] == "bbbb" &&
		dictionary["ccc"] == "ddd"  &&
		dictionary.size() == 2;

	EXPECT_TRUE(result);
}

TEST(AhoCorasick, createDictionary_TextDictionaryWithWrongFormatAtBothSides)
{
	std::string dictionaryTest = "extra characters\n#aaa# #bbbb#\n#ccc##ddd#\nextra characters";
	auto dictionary = createDictionary(dictionaryTest);

	auto result = dictionary["aaa"] == "bbbb" &&
		dictionary["ccc"] == "ddd"  &&
		dictionary.size() == 2;

	EXPECT_TRUE(result);
}

TEST(AhoCorasick, createDictionary_TextDictionaryWithWrongFormatInTheMiddle)
{
	std::string dictionaryTest = "extra characters\n#aaa# #bbbb#\nwrong#wrong#wrong\n#ccc##ddd#\nextra characters";
	auto dictionary = createDictionary(dictionaryTest);

	auto result = dictionary["aaa"] == "bbbb" &&
		dictionary["ccc"] == "ddd"  &&
		dictionary.size() == 2;

	EXPECT_TRUE(result);
}

TEST(AhoCorasick, createDictionary_TextDictionaryWithExtendedAsciiCodeCharacters)
{
	std::string dictionaryTest = "extra ööööcharacters\n#©aÌ# #bbÄÈ#\nwrong#wrong#wroñg\n#c¶c##ddd#\nextra 	Ñ	Ñ	Ñ characters";
	auto dictionary = createDictionary(dictionaryTest);

	auto result = dictionary["©aÌ"] == "bbÄÈ" &&
		dictionary["c¶c"] == "ddd"  &&
		dictionary.size() == 2;

	EXPECT_TRUE(result);
}

TEST(AhoCorasick, createDictionary_EmptyTextDictionary)
{
	std::string dictionaryTest = "";
	auto dictionary = createDictionary(dictionaryTest);

	EXPECT_TRUE(dictionary.empty());
}

TEST(AhoCorasick, createDictionary_TextDictionaryWithOnlyDelimiters)
{
	std::string dictionaryTest = "####";
	auto dictionary = createDictionary(dictionaryTest);

	EXPECT_TRUE(dictionary.empty());
}

TEST(AhoCorasick, createDictionary_TextDictionaryWithOnlyDelimitersAndNewLines)
{
	std::string dictionaryTest = "####\n####\n###\n##\n";
	auto dictionary = createDictionary(dictionaryTest);

	EXPECT_TRUE(dictionary.empty());
}

//this test will also test assignFailNode function
//these functions are closely related
TEST(AhoCorasick, linkFailNodes_prefixTreeWithAllFailNodeCases)
{
	std::unique_ptr<Node> root = std::make_unique<Node>();
	addWordToTree(root.get(), "ab");
	addWordToTree(root.get(), "bab");
	addWordToTree(root.get(), "bca");
	addWordToTree(root.get(), "caa");
	addWordToTree(root.get(), "abbab");
	
	linkFailNodes(root.get());

	auto words_ab = getMatchedWordsFromTree(root.get(), "ab");
	auto test_ab = words_ab.size() == 1 && words_ab[0] == "ab";

	auto words_bab = getMatchedWordsFromTree(root.get(), "bab");
	auto test_bab = words_bab.size() == 2 && words_bab[0] == "bab" && words_bab[1] == "ab";

	auto words_bca = getMatchedWordsFromTree(root.get(), "bca");
	auto test_bca = words_bca.size() == 1 && words_bca[0] == "bca";

	auto words_caa = getMatchedWordsFromTree(root.get(), "caa");
	auto test_caa = words_caa.size() == 1 && words_caa[0] == "caa";

	auto words_abbab = getMatchedWordsFromTree(root.get(), "abbab");
	auto test_abbab = words_abbab.size() == 3 && words_abbab[0] == "abbab" &&
					  words_abbab[1] == "bab" && words_abbab[2] == "ab";

	auto result = test_ab && test_bab && test_bca && test_caa && test_abbab;

	EXPECT_TRUE(result);
}

TEST(AhoCorasick, linkFailNodes_prefixTreeWithAllFailNodeCases_usingBuildPrefixTreeFunction)
{
	std::string dictionaryText = "#ab# #1#\n#bab# #2#\n#bca#, #3#\n#caa#, #4#\n#abbab#, #5#";
	auto dictionary = createDictionary(dictionaryText);
	auto root = buildPrefixTree(dictionary);

	linkFailNodes(root.get());

	auto words_ab = getMatchedWordsFromTree(root.get(), "ab");
	auto test_ab = words_ab.size() == 1 && words_ab[0] == "ab";

	auto words_bab = getMatchedWordsFromTree(root.get(), "bab");
	auto test_bab = words_bab.size() == 2 && words_bab[0] == "bab" && words_bab[1] == "ab";

	auto words_bca = getMatchedWordsFromTree(root.get(), "bca");
	auto test_bca = words_bca.size() == 1 && words_bca[0] == "bca";

	auto words_caa = getMatchedWordsFromTree(root.get(), "caa");
	auto test_caa = words_caa.size() == 1 && words_caa[0] == "caa";

	auto words_abbab = getMatchedWordsFromTree(root.get(), "abbab");
	auto test_abbab = words_abbab.size() == 3 && words_abbab[0] == "abbab" &&
		words_abbab[1] == "bab" && words_abbab[2] == "ab";

	auto result = test_ab && test_bab && test_bca && test_caa && test_abbab;

	EXPECT_TRUE(result);
}

TEST(AhoCorasick, buildPrefixTree_simpleDictionary)
{
	std::string dictionaryText = "#ab# #1#\n#bab# #2#\n#bca#, #3#\n#caa#, #4#\n#caa#, #4#";
	auto dictionary = createDictionary(dictionaryText);

	auto root = buildPrefixTree(dictionary);
	bool result = getWordFromTree(root.get(), "ab") == static_cast<std::string>("ab") &&
		getWordFromTree(root.get(), "bab") == static_cast<std::string>("bab") &&
		getWordFromTree(root.get(), "bca") == static_cast<std::string>("bca") &&
		getWordFromTree(root.get(), "caa") == static_cast<std::string>("caa");

	EXPECT_TRUE(result);
}

TEST(AhoCorasick, processText_simpleText)
{
	std::string dictionaryText = "#aba# #6#\n#ab# #1#\n#bab# #2#\n#bca#, #3#\n#caa#, #4#\n#abbab#, #5#";
	auto dictionary = createDictionary(dictionaryText);
	auto root = buildPrefixTree(dictionary);
	linkFailNodes(root.get());

	auto result_matches = findMatches(root.get(), "ab abab bca caa bcaa");

	std::vector<std::tuple<size_t, std::string>> expected_matches = {
						std::make_tuple(static_cast<size_t>(0), static_cast<std::string>("ab")),
					    std::make_tuple(static_cast<size_t>(3), static_cast<std::string>("ab")),
						std::make_tuple(static_cast<size_t>(3), static_cast<std::string>("aba")),
						std::make_tuple(static_cast<size_t>(4), static_cast<std::string>("bab")),
						std::make_tuple(static_cast<size_t>(5), static_cast<std::string>("ab")),
						std::make_tuple(static_cast<size_t>(8), static_cast<std::string>("bca")),
						std::make_tuple(static_cast<size_t>(12), static_cast<std::string>("caa")),
						std::make_tuple(static_cast<size_t>(16), static_cast<std::string>("bca")),
						std::make_tuple(static_cast<size_t>(17), static_cast<std::string>("caa"))
					
	};

	EXPECT_TRUE(result_matches == expected_matches);
}

TEST(AhoCorasick, solveOverlappings_OverlappingMatches)
{
	std::string text = "ab abab bca caa bcaa";
	std::vector<std::tuple<size_t, std::string>> matches = {
		std::make_tuple(static_cast<size_t>(0), "ab"),
		std::make_tuple(static_cast<size_t>(3), "ab"),
		std::make_tuple(static_cast<size_t>(3), "aba"),
		std::make_tuple(static_cast<size_t>(4), "bab"),
		std::make_tuple(static_cast<size_t>(5), "ab"),
		std::make_tuple(static_cast<size_t>(8), "bca"),
		std::make_tuple(static_cast<size_t>(12), "caa"),
		std::make_tuple(static_cast<size_t>(16), "bca"),
		std::make_tuple(static_cast<size_t>(17), "caa") };

	auto selectedMatches = solveOverlappings(matches, text.length());

	bool result = selectedMatches.size() == 5 &&
		selectedMatches[0] == "ab"  &&
		selectedMatches[3] == "aba"&&
		selectedMatches[8] == "bca" &&
		selectedMatches[12] == "caa"&&
		selectedMatches[16] == "bca";

	EXPECT_TRUE(result);
}

TEST(AhoCorasick, solveOverlappings_NoMatches)
{
	std::string text = "ab abab bca caa bcaa";
	std::vector<std::tuple<size_t, std::string>> matches;

	auto selectedMatches = solveOverlappings(matches, text.length());

	EXPECT_TRUE(selectedMatches.empty());
}

TEST(AhoCorasick, solveOverlappings_NoOverlappingMatches)
{
	std::string text = "bca caa bca";
	std::vector<std::tuple<size_t, std::string>> matches = {
		std::make_tuple(static_cast<size_t>(4), static_cast<std::string>("caa")),
		std::make_tuple(static_cast<size_t>(0), static_cast<std::string>("bca")),
		std::make_tuple(static_cast<size_t>(8), static_cast<std::string>("bca")) };

	auto selectedMatches = solveOverlappings(matches, text.length());

	bool result = selectedMatches.size() == 3 &&
		selectedMatches[0] == "bca" &&
		selectedMatches[4] == "caa"&&
		selectedMatches[8] == "bca";

	EXPECT_TRUE(result);
}

TEST(AhoCorasick, generateOutput_simpleInputText)
{
	std::string inputText = "ab abab bca caa bcaa";
	std::string dictionaryText = "#ab# #12#\n#aba##121#\n#bca# #231#\n#caa##311#";
	auto dictionary = createDictionary(dictionaryText);
	auto root = buildPrefixTree(dictionary);
	linkFailNodes(root.get());
	auto matches = findMatches(root.get(), inputText);
	auto selectedMatches = solveOverlappings(matches, inputText.length());
	
	auto output = generateOutput(inputText, dictionary, selectedMatches);

	std::string expectedOutput = "12 121b 231 311 231a";

	EXPECT_EQ(expectedOutput, output);
}

TEST(AhoCorasick, generateOutput_emptyInputText)
{
	std::string inputText = "";
	std::string dictionaryText = "#ab# #12#\n#aba##121#\n#bca# #231#\n#caa##311#";
	auto dictionary = createDictionary(dictionaryText);
	auto root = buildPrefixTree(dictionary);
	linkFailNodes(root.get());
	auto matches = findMatches(root.get(), inputText);
	auto selectedMatches = solveOverlappings(matches, inputText.length());

	auto output = generateOutput(inputText, dictionary, selectedMatches);

	std::string expectedOutput = "";

	EXPECT_EQ(expectedOutput, output);
}

TEST(AhoCorasick, generateOutput_InputTextWithExtendedAsciiCodes)
{
	std::string inputText = "aöö c¶c bbÄÈ caö aö";
	std::string dictionaryText = "#ab# #12#\n#aöö##121#\n#bbÄÈ# #©aÌ#\n#caö##311#\n#aö## ññ #";
	auto dictionary = createDictionary(dictionaryText);
	auto root = buildPrefixTree(dictionary);
	linkFailNodes(root.get());
	auto matches = findMatches(root.get(), inputText);
	auto selectedMatches = solveOverlappings(matches, inputText.length());

	auto output = generateOutput(inputText, dictionary, selectedMatches);

	std::string expectedOutput = "121 c¶c ©aÌ 311  ññ ";

	EXPECT_EQ(expectedOutput, output);
}

//IT LOOKS LIKE ROMANIAN CHARACTERS ARE NOT IN THE ASCII CODE?
//ANYWAY THEY ARE NOT RECOGNIZED, THEY ARE REPLACED WITH QUESTION MARK
//I WILL LEAVE IT AS IT IS FOR NOW
TEST(AhoCorasick, createDictionary_RomanianLetters)
{
	std::string dictionaryText = "# abgeleitet # # -------- #\n"
		"# zerstörtem # # ÄÈÄÈÄÈÄÈÄÈÄÈÄÈÄÈÄÈÄÈ #\n"
		"# erklären # # öööööööööööööööö #\n"
		"# einzige # # uerda #\n"
		"# 2007, # #2019.#\n"
		"# weiß und harmlos.# # carpe diem.#\n"
		"# Mineral # # MINERAL #\n"
		"# „Natrium-Lithium-Bor-Silikat-Hydroxid“ # # ĂĂăăĂîăÎÎȘ #\n"
		"# ță=ĂĂăăĂîăÎÎȘșșșșșțăăț # # Ramanujan #";
	auto dictionary = createDictionary(dictionaryText);

	bool result = dictionary[" abgeleitet "] == " -------- " &&
				dictionary[" zerstörtem "] == " ÄÈÄÈÄÈÄÈÄÈÄÈÄÈÄÈÄÈÄÈ " &&
				dictionary[" erklären "] == " öööööööööööööööö " &&
				dictionary[" einzige "] == " uerda " &&
				dictionary[" 2007, "] == "2019." &&
				dictionary[" weiß und harmlos."] == " carpe diem." &&
				dictionary[" Mineral "] == " MINERAL " &&
				dictionary[" „Natrium-Lithium-Bor-Silikat-Hydroxid“ "] == " \" ĂĂăăĂîăÎÎȘ " &&
				dictionary[" ță=ĂĂăăĂîăÎÎȘșșșșșțăăț "] == " Ramanujan "
				&& dictionary.size() == 9;

	EXPECT_TRUE(result);
}
