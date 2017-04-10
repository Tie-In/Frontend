const technicalFactors = [
  {
    id: 1,
    name: 'Distributed system',
    weight: 2,
    description: 'The architecture of the solution may be centralized or single-tenant ,or it may be distributed.'
  },
  {
    id: 2,
    name: 'Response time or throughput performance objectives',
    weight: 1,
    description: 'The quickness of response for users is an important (and non-trivial) factor.'
  },
  {
    id: 3,
    name: 'End user efficiency',
    weight: 1,
    description: 'Is the application being developed to optimize on user efficiency, or just capability?'
  },
  {
    id: 4,
    name: 'Complex internal processing',
    weight: 1,
    description: 'Is there a lot of difficult algorithmic work to do and test?'
  },
  {
    id: 5,
    name: 'Code must be reusable',
    weight: 1,
    description: 'Is heavy code reuse an objective or goal?'
  },
  {
    id: 6,
    name: 'Easy to install',
    weight: 0.5,
    description: 'Is heavy code reuse an objective or goal?'
  },
  {
    id: 7,
    name: 'Easy to use',
    weight: 0.5,
    description: 'Is ease of use a primary criteria for acceptance?'
  },
  {
    id: 8,
    name: 'Portable',
    weight: 2,
    description: 'Is multi-platform support required?'
  },
  {
    id: 9,
    name: 'Easy to change',
    weight: 1,
    description: 'Does the customer require the ability to change or customize the application in the future?'
  },
  {
    id: 10,
    name: 'Concurrent',
    weight: 1,
    description: 'Will you have to address database locking and other concurrency issues?'
  },
  {
    id: 11,
    name: 'Includes special security objectives',
    weight: 1,
    description: 'Can existing security solutions be leveraged, or must custom code be developed?'
  },
  {
    id: 12,
    name: 'Provides direct access for third parties',
    weight: 1,
    description: 'Will the application require the use of third party controls or libraries?'
  },
  {
    id: 13,
    name: 'Special user training facilities are required',
    weight: 1,
    description: 'How much user training is required? Is the application complex, or supporting complex activities?'
  },
];

const environmentalFactors = [
  {
    id: 1,
    name: 'Familiar with the project model that is used',
    weight: 1.5,
    description: 'How much experience does your team have working in this domain?'
  },
  {
    id: 2,
    name: 'Application experience',
    weight: 0.5,
    description: 'How much experience does your team have with the application?'
  },
  {
    id: 3,
    name: 'Object-oriented experience',
    weight: 1,
    description: 'How much experience does your team have at OO?'
  },
  {
    id: 4,
    name: 'Lead analyst capability',
    weight: 0.5,
    description: 'How knowledgeable and capable is the person responsible for the requirements?'
  },
  {
    id: 5,
    name: 'Motivation',
    weight: 1,
    description: 'How motivated is your team?'
  },
  {
    id: 6,
    name: 'Stable requirements',
    weight: 2,
    description: 'Changes in requirements can cause increases in work.'
  },
  {
    id: 7,
    name: 'Part-time staff',
    weight: -1,
    description: 'Team members that are part time, outside consultants, and developers who are splitting their time across projects.'
  },
  {
    id: 8,
    name: 'Difficult programming language',
    weight: -1,
    description: 'Harder languages represent higher numbers.'
  },
];

module.exports = {
  technicalFactors,
  environmentalFactors,
};
