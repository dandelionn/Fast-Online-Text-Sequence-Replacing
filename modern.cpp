#include "modern.h"

const int maximum(const int x, const int y)
{
    return x > y ? x : y; 
}

int findDiameter(std::queue<size_t>* tree, size_t root, size_t n)
{
    std::stack< std::tuple< size_t, size_t, size_t > > st;
	
    int diameter = 0;
    st.push(std::make_tuple(root, 0U, 0U));
	
    while(!st.empty())
    {
        const auto nodeId = std::get<0>(st.top());
	
        if(!tree[nodeId].empty())
        {
            st.push(std::make_tuple(tree[nodeId].front(), 0, 0));
            tree[nodeId].pop();
        }
        else
        {
            diameter = std::get<1>(st.top()) + std::get<2>(st.top()) + 1;
            const auto max = maximum(std::get<1>(st.top()), std::get<2>(st.top()));
            st.pop();
	
            if(!st.empty())
            {
                auto& value = std::get<1>(st.top()) < std::get<2>(st.top()) ?
                              std::get<1>(st.top()) : std::get<2>(st.top());
	
                value = value <= max ? max + 1 : value;
            }
        }
    }
	
    return diameter;
}

	
void execute()
{
    std::ifstream fin("./uploads/darb.in");
    std::ofstream fout("./uploads/darb.out");

    auto n = 0U;
    auto x = 0U;
    auto y = 0U;
    fin>>n;

    std::queue<size_t>* tree = new std::queue<size_t>[n+1];
	
    while(true)
    {
        fin >> x;
        fin >> y;
        fout << "x: " << x << " y: "<<y << '\n';
        if( fin.eof() ) break;
        tree[x].push(y);
    }
	
    const auto diameter = findDiameter(tree, 1, n);
    fout << "Size:" << n << '\n';
    fout << diameter <<'\n';
}