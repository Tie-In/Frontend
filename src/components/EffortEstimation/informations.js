const technicalFactors = [
  {
    id: 1,
    name: 'Distributed system',
    weight: 2,
  },
  {
    id: 2,
    name: 'Response time or throughput performance objectives',
    weight: 1,
  },
  {
    id: 3,
    name: 'End user efficiency',
    weight: 1,
  },
  {
    id: 4,
    name: 'Complex internal processing',
    weight: 1,
  },
  {
    id: 5,
    name: 'Code must be reusable',
    weight: 1,
  },
  {
    id: 6,
    name: 'Easy to install',
    weight: 0.5,
  },
  {
    id: 7,
    name: 'Easy to use',
    weight: 0.5,
  },
  {
    id: 8,
    name: 'Portable',
    weight: 2,
  },
  {
    id: 9,
    name: 'Easy to change',
    weight: 1,
  },
  {
    id: 10,
    name: 'Concurrent',
    weight: 1,
  },
  {
    id: 11,
    name: 'Includes special security objectives',
    weight: 1,
  },
  {
    id: 12,
    name: 'Provides direct access for third parties',
    weight: 1,
  },
  {
    id: 13,
    name: 'Special user training facilities are required',
    weight: 1,
  },
];

const environmentalFactors = [
  {
    id: 1,
    name: 'Familiar with the project model that is used',
    weight: 1.5,
  },
  {
    id: 2,
    name: 'Application experience',
    weight: 0.5,
  },
  {
    id: 3,
    name: 'Object-oriented experience',
    weight: 1,
  },
  {
    id: 4,
    name: 'Lead analyst capability',
    weight: 0.5,
  },
  {
    id: 5,
    name: 'Motivation',
    weight: 1,
  },
  {
    id: 6,
    name: 'Stable requirements',
    weight: 2,
  },
  {
    id: 7,
    name: 'Part-time staff',
    weight: -1,
  },
  {
    id: 8,
    name: 'Difficult programming language',
    weight: -1,
  },
];

module.exports = {
  technicalFactors,
  environmentalFactors,
};
