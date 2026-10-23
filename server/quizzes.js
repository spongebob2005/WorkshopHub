// Question sets per workshop id. Each array lines up with that workshop's learningContent.mcqs,
// so QUIZZES["7"][1] is the second quiz listed for workshop 7 ("OWASP Assessment").
// Served only through /api/workshops/:id/quizzes/:index, after the paid-booking check.

const q = (question, options, correctAnswer, explanation) => ({ question, options, correctAnswer, explanation });

export const QUIZZES = {
  // Advanced React Patterns & Best Practices
  "1": [
    [
      q("What is React primarily used for?", ["Database management", "Building user interfaces", "Server-side routing", "Network security"], 1, "React is a JavaScript library for building component-based user interfaces."),
      q("What does JSX compile to?", ["HTML strings", "React.createElement / jsx() calls", "Web Components", "CSS-in-JS objects"], 1, "JSX is syntax sugar that the compiler turns into function calls that create React elements."),
      q("Why does React need a `key` prop on list items?", ["To style each item", "To identify items between renders so it can reorder them efficiently", "To make items focusable", "To sort the list"], 1, "Keys let React match elements across renders instead of re-creating them."),
      q("Props in a component are…", ["Mutable by the child", "Read-only inputs passed from the parent", "Global variables", "Only for class components"], 1, "A component must never modify its own props; data flows down from the parent."),
      q("What is the virtual DOM?", ["A browser API", "An in-memory description of the UI that React diffs against", "A copy of the server's HTML", "A CSS layout engine"], 1, "React compares the new element tree with the previous one and applies only the differences to the real DOM."),
      q("Which pattern lets several components share implicit state, like <Tabs> and <Tab>?", ["Higher-order components", "Compound components", "Portals", "Error boundaries"], 1, "Compound components share state through context so the parent and children work together."),
      q("What does lifting state up mean?", ["Moving state into Redux", "Moving shared state to the closest common parent", "Storing state in localStorage", "Using a global variable"], 1, "When two siblings need the same data, the state lives in their nearest common ancestor."),
      q("What does React.memo do?", ["Caches API responses", "Skips re-rendering a component when its props haven't changed", "Memoizes a value inside a component", "Stores state permanently"], 1, "React.memo wraps a component and reuses the last render if props are shallowly equal."),
    ],
    [
      q("Which hook manages local state in a function component?", ["useEffect", "useState", "useRef", "useContext"], 1, "useState returns the current value and a setter that triggers a re-render."),
      q("When does a useEffect with an empty dependency array run?", ["On every render", "Once, after the first render", "Before the first render", "Never"], 1, "An empty array means the effect has no dependencies, so it runs after mount and cleans up on unmount."),
      q("What is the function returned from a useEffect callback for?", ["Returning data to the component", "Cleaning up subscriptions or timers", "Triggering a re-render", "Handling errors"], 1, "The cleanup runs before the effect re-runs and when the component unmounts."),
      q("Changing a useRef's .current value…", ["Triggers a re-render", "Does not trigger a re-render", "Throws an error", "Resets all state"], 1, "Refs hold mutable values that persist across renders without causing one."),
      q("Which hook caches the result of an expensive calculation between renders?", ["useCallback", "useMemo", "useEffect", "useId"], 1, "useMemo recomputes only when one of its dependencies changes."),
      q("useCallback is mainly used to…", ["Fetch data", "Keep the same function identity between renders", "Create a ref", "Read context"], 1, "A stable function reference prevents memoized children from re-rendering needlessly."),
      q("Which rule of hooks is correct?", ["Hooks can be called inside loops", "Hooks must be called at the top level of a component or custom hook", "Hooks work in class components", "Hooks can be called conditionally"], 1, "React relies on hooks being called in the same order on every render."),
      q("When is useReducer a better fit than useState?", ["For a single boolean", "When the next state depends on complex logic or several related values", "For refs to DOM nodes", "Only on the server"], 1, "A reducer centralizes state transitions, which keeps complex updates predictable."),
    ],
  ],

  // UI/UX Design Fundamentals
  "2": [
    [
      q("What does visual hierarchy control?", ["The file size of images", "The order in which people notice elements", "The page's load speed", "The number of pages"], 1, "Size, contrast, colour and position tell the eye what to look at first."),
      q("Which Gestalt principle says that items placed close together are seen as a group?", ["Similarity", "Proximity", "Closure", "Continuity"], 1, "Proximity is why spacing alone can group related controls."),
      q("What is the minimum WCAG AA contrast ratio for normal body text?", ["2:1", "3:1", "4.5:1", "7:1"], 2, "AA requires 4.5:1 for normal text and 3:1 for large text."),
      q("Whitespace in a layout…", ["Is wasted space", "Improves readability and separates content", "Should always be removed on mobile", "Only matters in print"], 1, "Negative space gives content room to breathe and makes groupings clear."),
      q("Fitts's Law suggests that important buttons should be…", ["Small and far away", "Large and easy to reach", "Hidden in menus", "Always red"], 1, "The time to hit a target depends on its size and distance."),
      q("What is the difference between UX and UI?", ["They are the same", "UX is the overall experience; UI is the visual and interactive surface", "UI is research; UX is colour", "UX is only for mobile"], 1, "UX covers the whole journey, while UI covers the screens and controls people touch."),
      q("Why use a consistent spacing scale (like 4px or 8px steps)?", ["It makes files smaller", "It keeps layouts rhythmic and predictable", "Browsers require it", "It improves SEO"], 1, "A shared scale removes arbitrary values and keeps the design system coherent."),
      q("Which is the best way to make a design accessible to colour-blind users?", ["Use more red and green", "Don't rely on colour alone to convey meaning", "Use only grey", "Increase the font weight"], 1, "Pair colour with text, icons or patterns so the meaning survives without colour."),
    ],
    [
      q("In Figma, what are components used for?", ["Exporting PDFs", "Reusable design elements whose instances update together", "Version control", "Writing code"], 1, "Editing the main component updates every instance of it."),
      q("What does Auto Layout do in Figma?", ["Arranges frames on the canvas randomly", "Resizes and spaces children automatically, like CSS flexbox", "Generates colour palettes", "Creates prototypes"], 1, "Auto Layout stacks children with set padding and gaps and grows with its content."),
      q("Variants in Figma let you…", ["Store several states of a component in one set", "Share files with clients", "Create animations only", "Import fonts"], 0, "A button can have default, hover and disabled variants inside one component set."),
      q("What is a low-fidelity wireframe for?", ["Final hand-off to developers", "Quickly exploring layout and structure before visual detail", "Printing", "Brand guidelines"], 1, "Low-fi wireframes are cheap to change, so they suit early exploration."),
      q("In Figma's prototype mode, an interaction is made of…", ["A layer and a colour", "A trigger and an action", "A font and a size", "A page and a frame"], 1, "For example, 'On click' (trigger) → 'Navigate to' (action)."),
      q("What are Figma styles (colour, text, effect) useful for?", ["Keeping values consistent and updating them in one place", "Adding plugins", "Reducing file size", "Recording user tests"], 0, "Changing a style updates every layer that uses it."),
      q("A usability test mainly measures…", ["How pretty the design is", "Whether real users can complete tasks", "Server performance", "Brand awareness"], 1, "Watching people attempt tasks reveals where the design confuses them."),
      q("What does Dev Mode in Figma give developers?", ["Inspectable measurements, styles and assets", "A code compiler", "Hosting for the site", "Automatic deployment"], 0, "Developers can read spacing, CSS values and export assets without editing the design."),
    ],
  ],

  // Python for Data Science
  "3": [
    [
      q("Which data type is immutable in Python?", ["list", "dict", "tuple", "set"], 2, "Tuples can't be changed after creation; lists, dicts and sets can."),
      q("What does `len([1, 2, 3])` return?", ["2", "3", "4", "An error"], 1, "len() returns the number of items in the sequence."),
      q("Which keyword defines a function?", ["func", "def", "function", "lambda only"], 1, "Functions are defined with `def name(args):`."),
      q("What is the output of `[x * 2 for x in range(3)]`?", ["[2, 4, 6]", "[0, 2, 4]", "[0, 1, 2]", "[1, 2, 3]"], 1, "range(3) yields 0, 1 and 2, and each is doubled."),
      q("How do you read a value from a dict safely, with a default?", ["d[key]", "d.get(key, default)", "d.read(key)", "d.find(key)"], 1, "get() returns the default instead of raising KeyError."),
      q("What does `5 // 2` evaluate to?", ["2.5", "2", "3", "1"], 1, "// is floor division, so the result is rounded down to 2."),
      q("Which statement handles an exception?", ["catch", "try / except", "error / handle", "guard"], 1, "Python uses try / except (with optional else and finally)."),
      q("What is a virtual environment (venv) for?", ["Running Python in the browser", "Isolating a project's packages from other projects", "Speeding up code", "Encrypting files"], 1, "Each venv has its own installed packages, so projects don't conflict."),
    ],
    [
      q("Which library provides the DataFrame structure?", ["NumPy", "pandas", "Matplotlib", "requests"], 1, "pandas builds DataFrames on top of NumPy arrays."),
      q("What does `df.head()` show by default?", ["The last 5 rows", "The first 5 rows", "Column names only", "Summary statistics"], 1, "head() returns the first n rows, with n defaulting to 5."),
      q("Which method gives count, mean, std, min and max for numeric columns?", ["df.info()", "df.describe()", "df.shape", "df.count()"], 1, "describe() produces summary statistics."),
      q("How do you drop rows that contain missing values?", ["df.fillna()", "df.dropna()", "df.remove_na()", "df.clean()"], 1, "dropna() removes rows (or columns) with NaN values; fillna() replaces them."),
      q("What does `df.groupby('city')['sales'].sum()` do?", ["Sorts by city", "Totals sales for each city", "Counts the cities", "Removes duplicate cities"], 1, "groupby splits the rows by city, and sum aggregates each group."),
      q("Why are NumPy array operations faster than Python loops?", ["They use the GPU", "They run vectorized in compiled C code", "They skip some elements", "They use less precise numbers"], 1, "Vectorized operations avoid per-element Python overhead."),
      q("Which chart best shows the distribution of a single numeric variable?", ["Pie chart", "Histogram", "Line chart", "Scatter plot"], 1, "A histogram bins the values to show the shape of the distribution."),
      q("A correlation coefficient of −0.9 means…", ["No relationship", "A strong negative linear relationship", "A weak positive relationship", "One variable causes the other"], 1, "Values near −1 mean one variable falls as the other rises; correlation is not causation."),
    ],
  ],

  // Digital Marketing Strategy 2026
  "4": [
    [
      q("What does SEO stand for?", ["Search Engine Optimization", "Social Engagement Output", "Site Error Overview", "Search Ad Operation"], 0, "SEO is improving a site so it ranks better in organic search results."),
      q("Which HTML element matters most for a page's search result headline?", ["<footer>", "<title>", "<span>", "<aside>"], 1, "The title tag is usually shown as the clickable headline in search results."),
      q("What is a backlink?", ["A broken link", "A link from another site to yours", "A link back to the homepage", "A paid ad"], 1, "Quality backlinks signal authority to search engines."),
      q("Long-tail keywords are…", ["Very short, broad terms", "Longer, more specific phrases with lower competition", "Brand names only", "Keywords in the footer"], 1, "Specific phrases like 'cheap running shoes for flat feet' convert well and are easier to rank for."),
      q("What does a meta description mainly influence?", ["Ranking directly", "Click-through rate from the search results page", "Page load speed", "Image quality"], 1, "It's the snippet under the title; a good one persuades people to click."),
      q("Why does mobile-friendliness matter for SEO?", ["It doesn't", "Google indexes the mobile version of pages first", "Mobile pages have no ads", "Desktop sites are banned"], 1, "With mobile-first indexing, the mobile page is what gets evaluated."),
      q("What is 'search intent'?", ["The number of searches", "The goal behind a query, e.g. informational or transactional", "A Google penalty", "An ad bidding strategy"], 1, "Matching content to intent is key to ranking and converting."),
      q("Which tool shows how Google crawls and indexes your site?", ["Google Search Console", "Photoshop", "Mailchimp", "Canva"], 0, "Search Console reports indexing, queries, clicks and crawl errors."),
    ],
    [
      q("What is a marketing funnel?", ["A type of ad", "The stages a customer moves through, from awareness to purchase", "An email template", "A website layout"], 1, "Common stages are awareness, consideration, conversion and retention."),
      q("CAC stands for…", ["Customer Acquisition Cost", "Content And Campaigns", "Click Average Count", "Conversion After Click"], 0, "CAC is the total spend on acquiring customers divided by the number of new customers."),
      q("A healthy business usually wants Customer Lifetime Value (LTV) to be…", ["Lower than CAC", "Several times higher than CAC", "Equal to zero", "Unrelated to CAC"], 1, "An LTV:CAC ratio around 3:1 is a common benchmark."),
      q("What is A/B testing?", ["Testing two ads at once on different platforms", "Comparing two versions to see which performs better", "Grading campaigns A or B", "A spelling check"], 1, "Traffic is split between variants and the results are compared."),
      q("What does a buyer persona describe?", ["A competitor", "A semi-fictional profile of your ideal customer", "A pricing plan", "A sales script"], 1, "Personas capture goals, pain points and behaviour to guide messaging."),
      q("Conversion rate is calculated as…", ["Clicks ÷ impressions", "Conversions ÷ visitors", "Revenue ÷ cost", "Followers ÷ posts"], 1, "Clicks ÷ impressions is click-through rate; conversion rate uses completed goals."),
      q("Which channel is 'owned media'?", ["Paid search ads", "Your email list and website", "A news article about you", "Influencer sponsorships"], 1, "Owned media are channels you control; earned media is coverage others give you."),
      q("Why do marketers set SMART goals?", ["They are required by law", "They make goals Specific, Measurable, Achievable, Relevant and Time-bound", "They reduce ad costs automatically", "They replace analytics"], 1, "Measurable, time-bound goals let you judge whether a strategy worked."),
    ],
  ],

  // Cloud Architecture with AWS
  "5": [
    [
      q("Which AWS service provides virtual servers?", ["S3", "EC2", "RDS", "IAM"], 1, "EC2 (Elastic Compute Cloud) runs virtual machine instances."),
      q("What is Amazon S3 used for?", ["Running containers", "Object storage for files", "DNS", "Sending email"], 1, "S3 stores objects in buckets and is highly durable."),
      q("Which service manages users, roles and permissions?", ["IAM", "CloudWatch", "VPC", "Lambda"], 0, "IAM (Identity and Access Management) controls who can do what."),
      q("What is an Availability Zone?", ["A pricing tier", "One or more isolated data centres within a region", "A global CDN", "A backup service"], 1, "Spreading resources across AZs protects against a single data-centre failure."),
      q("AWS Lambda is an example of…", ["Bare-metal hosting", "Serverless compute that runs code in response to events", "A database", "A load balancer"], 1, "You upload functions, and AWS runs and scales them on demand."),
      q("Which service is AWS's managed relational database?", ["DynamoDB", "RDS", "S3", "SQS"], 1, "RDS runs MySQL, PostgreSQL and others for you; DynamoDB is NoSQL."),
      q("Under the shared responsibility model, AWS is responsible for…", ["Your application code", "Security of the cloud: the hardware and facilities", "Your IAM passwords", "Your data encryption choices"], 1, "AWS secures the infrastructure; you secure what you put in it."),
      q("Which service monitors metrics and logs?", ["CloudWatch", "CloudFront", "Route 53", "Glacier"], 0, "CloudWatch collects metrics, logs and alarms."),
    ],
    [
      q("What does horizontal scaling mean?", ["Using a bigger server", "Adding more servers to share the load", "Adding more disk space", "Reducing traffic"], 1, "Vertical scaling means a bigger machine; horizontal means more machines."),
      q("What does an Elastic Load Balancer do?", ["Stores files", "Distributes incoming traffic across healthy targets", "Encrypts databases", "Registers domains"], 1, "It spreads requests and routes around unhealthy instances."),
      q("Why deploy across multiple Availability Zones?", ["It's cheaper", "For high availability if one AZ fails", "To use more regions", "It's required for S3"], 1, "Multi-AZ designs survive the loss of a single zone."),
      q("Which service puts content on edge locations close to users?", ["CloudFront", "EC2", "EBS", "IAM"], 0, "CloudFront is AWS's CDN; it caches content near users."),
      q("In a VPC, a public subnet is one that…", ["Has no IP addresses", "Has a route to an internet gateway", "Only holds databases", "Can't reach other subnets"], 1, "Databases usually sit in private subnets without a direct internet route."),
      q("What does an Auto Scaling group do?", ["Changes instance types every hour", "Adds or removes instances based on demand or health", "Backs up S3", "Compresses images"], 1, "It keeps the right number of instances running as load changes."),
      q("What is a decoupled architecture, for example with SQS?", ["Everything runs on one server", "Components communicate through queues so they can fail and scale independently", "Removing the database", "Using only Lambda"], 1, "A queue buffers work between producers and consumers."),
      q("Which AWS Well-Architected pillar focuses on recovering from failures?", ["Cost Optimization", "Reliability", "Sustainability", "Operational Excellence"], 1, "Reliability covers fault tolerance, recovery and handling changes in demand."),
    ],
  ],

  // Mobile App Development with React Native
  "6": [
    [
      q("React Native renders UI using…", ["A WebView", "Native platform components", "HTML canvas", "Flash"], 1, "Components like <View> map to real native views on iOS and Android."),
      q("Which component is used to show text?", ["<p>", "<Text>", "<span>", "<Label>"], 1, "All text in React Native must be inside a <Text> component."),
      q("What is the basic layout container, similar to a <div>?", ["<View>", "<Box>", "<Container>", "<Section>"], 0, "<View> is the fundamental building block for layout."),
      q("What is the default flexDirection in React Native?", ["row", "column", "row-reverse", "none"], 1, "Unlike the web, React Native defaults to column."),
      q("How are styles usually defined?", ["CSS files", "StyleSheet.create with JavaScript objects", "Inline HTML attributes", "SASS"], 1, "Styles are JS objects with camelCased properties."),
      q("Which component efficiently renders long scrolling lists?", ["ScrollView", "FlatList", "ListView", "Table"], 1, "FlatList renders only the items on screen; ScrollView renders everything."),
      q("What is Expo?", ["A database", "A framework and toolset that simplifies building React Native apps", "An iOS-only SDK", "A testing library"], 1, "Expo provides tooling, native APIs and an easy development workflow."),
      q("Which component handles taps with visual feedback?", ["<Button> only", "<Pressable>", "<Touch>", "<Click>"], 1, "Pressable detects press interactions and can style its pressed state."),
    ],
    [
      q("Which library is the most common choice for navigating between screens?", ["React Router DOM", "React Navigation", "Next Router", "Redux"], 1, "React Navigation provides stack, tab and drawer navigators."),
      q("Where should you store a user's auth token on a mobile device?", ["In plain AsyncStorage", "In secure storage such as Keychain or Keystore", "In a global variable", "In the app's source code"], 1, "Secure storage encrypts sensitive values; AsyncStorage is unencrypted."),
      q("Why use SafeAreaView or safe-area insets?", ["For security", "To keep content clear of notches and system bars", "To speed up rendering", "For dark mode"], 1, "Safe areas avoid the status bar, home indicator and notches."),
      q("What does Platform.OS let you do?", ["Change the OS version", "Run different code for iOS and Android", "Install native modules", "Detect the network"], 1, "Platform.OS returns 'ios' or 'android' for platform-specific tweaks."),
      q("Which approach makes an app work when it's offline?", ["Disable the app", "Cache data locally and sync when the connection returns", "Only use images", "Reload repeatedly"], 1, "Local persistence plus sync gives a smooth offline experience."),
      q("What must an app do before using the camera or location?", ["Nothing", "Request the user's permission at runtime", "Restart the phone", "Pay a fee"], 1, "Both iOS and Android require runtime permission prompts for sensitive APIs."),
      q("Why should heavy work be kept off the JS thread?", ["It's not allowed", "A blocked JS thread makes animations and touches stutter", "It uses less battery to block", "To hide errors"], 1, "Long tasks freeze the UI; native-driven animations and background work help."),
      q("How are apps distributed to users?", ["By email only", "Through the Apple App Store and Google Play Store", "Through npm", "Through GitHub Pages"], 1, "Production builds are signed and submitted to the stores for review."),
    ],
  ],

  // Cybersecurity Essentials
  "7": [
    [
      q("What does the CIA triad stand for?", ["Control, Integrity, Access", "Confidentiality, Integrity, Availability", "Cyber, Internet, Authentication", "Code, Infrastructure, Audit"], 1, "These are the three core goals of information security."),
      q("What is phishing?", ["A firewall rule", "Tricking people into revealing information or clicking malicious links", "A type of encryption", "A backup method"], 1, "Phishing usually arrives as convincing fake emails or messages."),
      q("Multi-factor authentication requires…", ["Two passwords", "Two or more different kinds of proof, e.g. a password and a phone code", "A longer username", "Admin approval"], 1, "Combining something you know, have or are blocks most account takeovers."),
      q("What does a firewall do?", ["Speeds up the internet", "Filters network traffic based on rules", "Encrypts disks", "Removes viruses from files"], 1, "Firewalls allow or block traffic by port, address or protocol."),
      q("Which password is strongest?", ["Password123", "A long, unique passphrase stored in a password manager", "Your birthday", "The same password everywhere"], 1, "Length and uniqueness matter most; reusing passwords spreads breaches."),
      q("What is ransomware?", ["Free antivirus", "Malware that encrypts files and demands payment", "A secure protocol", "An ad blocker"], 1, "Offline backups are the main defence against ransomware."),
      q("What does HTTPS add over HTTP?", ["Faster pages", "Encryption and server authentication via TLS", "Better SEO only", "Bigger images"], 1, "TLS protects data in transit from eavesdropping and tampering."),
      q("The principle of least privilege means…", ["Everyone gets admin access", "Users get only the access they need for their job", "Nobody gets access", "Passwords expire daily"], 1, "Limiting access limits the damage from a compromised account."),
    ],
    [
      q("What is SQL injection?", ["A database backup", "Inserting malicious SQL through unsanitized input", "A fast query", "An index type"], 1, "Untrusted input concatenated into a query can change what the query does."),
      q("What is the main defence against SQL injection?", ["Hiding the database", "Parameterized queries / prepared statements", "Longer table names", "Using HTTPS"], 1, "Parameters keep data separate from the SQL code."),
      q("Cross-site scripting (XSS) lets an attacker…", ["Read the server's disk", "Run their script in other users' browsers", "Crash the database", "Change DNS"], 1, "Escaping output and a Content Security Policy help prevent XSS."),
      q("Broken Access Control (OWASP A01) means…", ["Slow logins", "Users can act outside their intended permissions", "Weak Wi-Fi", "Expired certificates"], 1, "For example, changing an ID in the URL to view someone else's data."),
      q("What does CSRF trick a logged-in user's browser into doing?", ["Downloading malware", "Sending an unwanted request to a site they're signed into", "Clearing cookies", "Changing screen resolution"], 1, "Anti-CSRF tokens and SameSite cookies are common defences."),
      q("How should passwords be stored on the server?", ["Plain text", "Hashed with a slow algorithm like bcrypt or Argon2", "Base64 encoded", "Encrypted with a key kept in the code"], 1, "Slow, salted hashes make stolen password databases hard to crack."),
      q("'Security misconfiguration' includes…", ["Using strong defaults", "Leaving default credentials or verbose error messages enabled", "Patching regularly", "Using MFA"], 1, "Default accounts, open storage buckets and stack traces are common examples."),
      q("Why does using components with known vulnerabilities matter?", ["It doesn't", "Attackers exploit published flaws in outdated libraries", "Old libraries are faster", "It only affects mobile apps"], 1, "Tools like npm audit and Dependabot flag vulnerable dependencies."),
    ],
  ],

  // Blockchain & Smart Contracts
  "8": [
    [
      q("What is a blockchain?", ["A central database run by one company", "A distributed ledger of linked, tamper-evident blocks", "A type of cryptocurrency wallet", "A cloud storage service"], 1, "Each block references the previous block's hash, forming a chain."),
      q("What links one block to the previous one?", ["A timestamp only", "The previous block's cryptographic hash", "An email address", "A random number"], 1, "Changing an old block changes its hash and breaks every later link."),
      q("Proof of Work secures a network by…", ["Voting by email", "Making miners spend computation to propose blocks", "Letting the richest user decide", "Using passwords"], 1, "Rewriting history would require redoing that work faster than the honest network."),
      q("In Proof of Stake, validators are chosen based on…", ["Their computing power", "The cryptocurrency they lock up as stake", "Their age", "Random IP addresses"], 1, "Misbehaving validators can lose (be slashed) part of their stake."),
      q("What is a private key used for?", ["Sharing publicly to receive funds", "Signing transactions to prove ownership", "Mining blocks", "Naming the wallet"], 1, "Anyone with the private key controls the funds, so it must stay secret."),
      q("What does 'immutable' mean for a blockchain?", ["Data can be edited by admins", "Confirmed records are practically impossible to change", "It never goes offline", "It has no fees"], 1, "Immutability comes from hashing and consensus."),
      q("What is a node?", ["A token", "A computer that keeps a copy of the chain and relays transactions", "A smart contract", "A wallet password"], 1, "Many independent nodes make the network decentralized."),
      q("What are gas fees on Ethereum?", ["Fuel for mining rigs", "Payments for the computation a transaction uses", "Exchange membership fees", "Wallet subscription costs"], 1, "Gas prices rise when the network is busy."),
    ],
    [
      q("What is a smart contract?", ["A legal PDF", "A program stored on the blockchain that runs when called", "An exchange account", "A mining pool agreement"], 1, "Its code and state live on-chain and execute deterministically."),
      q("Which language is most used for Ethereum smart contracts?", ["Python", "Solidity", "Go", "Ruby"], 1, "Solidity compiles to EVM bytecode."),
      q("What happens to a smart contract's code after it's deployed?", ["It can be edited freely", "It can't be changed unless an upgrade pattern was built in", "It expires after a year", "It moves to a server"], 1, "Upgradeable proxies are a deliberate design choice, not the default."),
      q("What is a reentrancy attack?", ["Logging in twice", "A contract being called back before it updates its state, e.g. draining funds", "A network outage", "A failed deployment"], 1, "The 2016 DAO hack was a reentrancy attack. Update state before making external calls."),
      q("ERC-20 is a standard for…", ["NFTs", "Fungible tokens", "Wallet passwords", "Mining hardware"], 1, "ERC-721 is the standard for NFTs."),
      q("What is an oracle in blockchain?", ["A database company", "A service that brings off-chain data, like prices, on-chain", "A mining algorithm", "A wallet"], 1, "Contracts can't fetch external data themselves, so oracles supply it."),
      q("Why test contracts on a testnet first?", ["Testnets are faster", "Mistakes cost no real money and bugs can be fixed before deployment", "Mainnet doesn't allow new contracts", "It's required by law"], 1, "Bugs on mainnet can be permanent and expensive."),
      q("What does a Solidity `require()` statement do?", ["Imports a library", "Reverts the transaction if a condition is false", "Sends ether", "Creates a token"], 1, "It's the standard way to validate inputs and permissions."),
    ],
  ],
};

export const getQuiz = (workshopId, index) => QUIZZES[workshopId]?.[index] ?? null;
