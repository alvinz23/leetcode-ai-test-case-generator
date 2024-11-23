import React, { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Select,
  MenuItem,
  TextField,
  Chip,
  Tab,
  Tabs,
  Box,
  IconButton,
  Paper,
  InputAdornment,
} from '@mui/material';
import {
  ContentCopy as CopyIcon,
  Check as CheckIcon,
  Search as SearchIcon,
  KeyboardArrowDown as ArrowDownIcon,
} from '@mui/icons-material';

const Blind75TestCases = () => {
  const [selectedProblem, setSelectedProblem] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedStates, setCopiedStates] = useState({});
  const [tabValue, setTabValue] = useState(0);

  const blind75Problems = {
    "Two Sum": {
      difficulty: "Easy",
      category: "Array",
      smallCase: {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]"
      },
      mediumCase: {
        input: "nums = [3,2,4,1,7,8,9,10], target = 17",
        output: "[4,7]",
        explanation: "nums[4] + nums[7] = 7 + 10 = 17"
      },
      largeCase: {
        input: "nums = [large array with 10000 elements], target = 19999",
        output: "[9998,9999]",
        explanation: "Last two elements sum to target"
      },
      edgeCases: [
        {
          input: "nums = [2,2], target = 4",
          output: "[0,1]",
          explanation: "Same element can't be used twice"
        },
        {
          input: "nums = [1], target = 1",
          output: "[]",
          explanation: "No solution exists"
        }
      ]
    },
    "Valid Parentheses": {
      difficulty: "Easy",
      category: "Stack",
      smallCase: {
        input: 's = "()"',
        output: "true",
        explanation: "Simple matching pair"
      },
      mediumCase: {
        input: 's = "([{}])"',
        output: "true",
        explanation: "Multiple nested valid pairs"
      },
      largeCase: {
        input: 's = "({[]}){[]}({[]}){[]}...repeated 1000 times"',
        output: "true",
        explanation: "Large valid string with multiple patterns"
      },
      edgeCases: [
        {
          input: 's = "["',
          output: "false",
          explanation: "Single opening bracket"
        },
        {
          input: 's = ")("',
          output: "false",
          explanation: "Correct brackets in wrong order"
        }
      ]
    },
    "Longest Substring Without Repeating Characters": {
      difficulty: "Medium",
      category: "String",
      smallCase: {
        input: 's = "abcabcbb"',
        output: "3",
        explanation: "The answer is 'abc', with length 3"
      },
      mediumCase: {
        input: 's = "pwwkew"',
        output: "3",
        explanation: "The answer is 'wke', with length 3"
      },
      largeCase: {
        input: 's = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"',
        output: "52",
        explanation: "All unique characters"
      },
      edgeCases: [
        {
          input: 's = ""',
          output: "0",
          explanation: "Empty string"
        },
        {
          input: 's = " "',
          output: "1",
          explanation: "Single space"
        }
      ]
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return {
          color: '#00796b',
          backgroundColor: '#e0f2f1'
        };
      case 'medium':
        return {
          color: '#f57c00',
          backgroundColor: '#fff3e0'
        };
      case 'hard':
        return {
          color: '#c62828',
          backgroundColor: '#ffebee'
        };
      default:
        return {
          color: '#616161',
          backgroundColor: '#f5f5f5'
        };
    }
  };

  const filteredProblems = useMemo(() => {
    return Object.entries(blind75Problems).filter(([name]) =>
      name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedStates(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setCopiedStates(prev => ({ ...prev, [id]: false }));
    }, 2000);
  };

  const renderTestCase = (testCase, id) => (
    <Paper elevation={1} sx={{ p: 2, mb: 2, '&:hover': { bgcolor: 'grey.50' } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="subtitle1" color="text.secondary">Input:</Typography>
        <IconButton 
          size="small" 
          onClick={() => handleCopy(testCase.input, id)}
          color={copiedStates[id] ? "success" : "default"}
        >
          {copiedStates[id] ? <CheckIcon /> : <CopyIcon />}
        </IconButton>
      </Box>
      <Paper variant="outlined" sx={{ p: 1, mb: 2, fontFamily: 'monospace', fontSize: '0.875rem' }}>
        {testCase.input}
      </Paper>
      
      <Typography variant="subtitle1" color="text.secondary">Output:</Typography>
      <Paper variant="outlined" sx={{ p: 1, mb: 2, fontFamily: 'monospace', fontSize: '0.875rem' }}>
        {testCase.output}
      </Paper>
      
      <Typography variant="subtitle1" color="text.secondary">Explanation:</Typography>
      <Typography variant="body2" color="text.secondary">
        {testCase.explanation}
      </Typography>
    </Paper>
  );

  const TabPanel = ({ children, value, index, ...other }) => (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  );

  return (
    <Card sx={{ maxWidth: 800, mx: 'auto' }}>
      <CardHeader 
        title={
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5">Blind 75 Test Cases</Typography>
            <Box>
              <Chip 
                label="LeetCode" 
                sx={{ mr: 1 }}
                color="primary" 
                variant="outlined" 
              />
              <Chip 
                label="Blind 75" 
                color="secondary" 
                variant="outlined" 
              />
            </Box>
          </Box>
        }
      />
      
      <CardContent>
        <TextField
          fullWidth
          placeholder="Search problems..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <Select
          fullWidth
          value={selectedProblem}
          onChange={(e) => setSelectedProblem(e.target.value)}
          displayEmpty
          sx={{ mb: 3 }}
        >
          <MenuItem value="">
            <Typography color="text.secondary">Choose a problem</Typography>
          </MenuItem>
          {filteredProblems.map(([problem, details]) => (
            <MenuItem key={problem} value={problem}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                <Typography>{problem}</Typography>
                <Box>
                  <Chip
                    label={details.difficulty}
                    size="small"
                    sx={{ 
                      mr: 1,
                      ...getDifficultyColor(details.difficulty)
                    }}
                  />
                  <Chip
                    label={details.category}
                    size="small"
                    variant="outlined"
                  />
                </Box>
              </Box>
            </MenuItem>
          ))}
        </Select>

        {selectedProblem ? (
          <>
            <Tabs 
              value={tabValue} 
              onChange={(_, newValue) => setTabValue(newValue)}
              sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
            >
              <Tab label="Test Cases" />
              <Tab label="Edge Cases" />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
              <Typography variant="h6" gutterBottom>Small Test Case</Typography>
              {renderTestCase(blind75Problems[selectedProblem].smallCase, 'small')}
              
              <Typography variant="h6" gutterBottom>Medium Test Case</Typography>
              {renderTestCase(blind75Problems[selectedProblem].mediumCase, 'medium')}
              
              <Typography variant="h6" gutterBottom>Large Test Case</Typography>
              {renderTestCase(blind75Problems[selectedProblem].largeCase, 'large')}
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              {blind75Problems[selectedProblem].edgeCases.map((edgeCase, index) => (
                <Box key={index}>
                  <Typography variant="h6" gutterBottom>Edge Case {index + 1}</Typography>
                  {renderTestCase(edgeCase, `edge-${index}`)}
                </Box>
              ))}
            </TabPanel>
          </>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
            <ArrowDownIcon sx={{ fontSize: 48, mb: 2 }} />
            <Typography>Select a problem to view test cases</Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default Blind75TestCases;