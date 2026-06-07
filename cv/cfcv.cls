% cfcv.cls — CareerForge CV Class
% Adapted from a personal CV class for open-source distribution.
% Author: https://github.com/suraj-davariya
% Licence: MIT
% Compiler: lualatex
%
% Changes from original:
%   - Class renamed to cfcv
%   - \cvachievement fixed: 4 args {icon}{title}{date}{description}
%   - \orcidsymbol: safe fallback (academicons not required)
%   - \func renamed to \cfcvtag to avoid namespace collision
%   - Removed all \textls[] letter-spacing (ATS fix: parsers read spaced chars as individual letters)
%   - \makecvheader redesigned to match cfcl.cls cover letter header (uniform visual identity)
%   - \project macro kept but intentionally unused in templates (consulting pattern, too heavy)

\ProvidesClass{cfcv}
\LoadClass{article}
\RequirePackage[margin=2cm]{geometry}
\RequirePackage{microtype}
\RequirePackage{tcolorbox}
\RequirePackage{hyperref}
\RequirePackage{xcolor}

% ── Colours (identical to cfcl.cls) ──────────────────────────────────────────
\definecolor{VividPurple}{HTML}{2E64FE}
\definecolor{SlateGrey}{HTML}{2E2E2E}
\definecolor{LightGrey}{HTML}{555555}
\definecolor{AzureRadiance}{HTML}{00ABFF}
\definecolor{DodgerBlue}{HTML}{4F83FF}
\definecolor{ElectricViolet}{HTML}{9F00FF}
\definecolor{Black}{HTML}{000000}
\colorlet{accent}{DodgerBlue}
\colorlet{body}{Black!80}

% ── Icons (FontAwesome 4 via CTAN package — lualatex compatible) ──────────────
\RequirePackage{fontawesome}
\newcommand{\emailsymbol}      {\faAt}
\newcommand{\phonesymbol}      {\faPhone}
\newcommand{\homepagesymbol}   {\faGlobe}
\newcommand{\locationsymbol}   {\faMapMarker}
\newcommand{\linkedinsymbol}   {\faLinkedinSquare}
\newcommand{\twittersymbol}    {\faTwitter}
\newcommand{\githubsymbol}     {\faGithub}
\newcommand{\orcidsymbol}      {\textsc{orcid}} % safe fallback; \RequirePackage{academicons} + \aiOrcid if needed
\newcommand{\mailsymbol}       {\faEnvelope}
\newcommand{\devsymbol}        {\faCode}
\newcommand{\linksymbol}       {\faExternalLink}
\newcommand{\certificatesymbol}{\faCertificate}

% ── Contact item helpers ──────────────────────────────────────────────────────
\newcommand{\printinfo}[2]{\mbox{\textcolor{accent}{#1}\hspace{0.4em}#2\hspace{1.8em}}}
\newcommand{\email}[1]       {\printinfo{\emailsymbol}{#1}}
\newcommand{\mailaddress}[1] {\printinfo{\emailsymbol}{\href{mailto:#1}{#1}}}
\newcommand{\phone}[1]       {\printinfo{\phonesymbol}{\href{tel:#1}{#1}}}
\newcommand{\homepage}[2]    {\printinfo{\homepagesymbol}{\href{#2}{#1}}}
\newcommand{\twitter}[1]     {\printinfo{\twittersymbol}{#1}}
\newcommand{\linkedin}[2]    {\printinfo{\linkedinsymbol}{\href{#2}{#1}}}
\newcommand{\github}[2]      {\printinfo{\githubsymbol}{\href{#2}{#1}}}
\newcommand{\orcid}[1]       {\printinfo{\orcidsymbol}{#1}}
\newcommand{\location}[1]    {\printinfo{\locationsymbol}{#1}}

% ── Document metadata ─────────────────────────────────────────────────────────
\newcommand{\name}[1]        {\def\@name{#1}}
\newcommand{\tagline}[1]     {\def\@tagline{#1}}
\newcommand{\personalinfo}[1]{\def\@personalinfo{#1}}

% ── Vertical rhythm ───────────────────────────────────────────────────────────
\setlength{\smallskipamount}{3pt}
\setlength{\medskipamount}{4pt}
\setlength{\bigskipamount}{5pt}
\setlength{\parindent}{0pt}

% ── Button (cert links) ───────────────────────────────────────────────────────
\newcommand{\button}[1]{\tcbox[colback=white, colframe=accent, coltext=black,
  boxrule=0.5mm, arc=1mm, boxsep=4pt, left=5pt, right=5pt,
  top=2pt, bottom=2pt]{#1}}

% ── Header — uniform with cfcl.cls cover letter ───────────────────────────────
% Name:    large bold black uppercase  (no letter-spacing — ATS fix)
% Tagline: small bold accent           (no letter-spacing — ATS fix)
% Contact: footnotesize bold centred
% Rule:    1.2pt DodgerBlue (matches cfcl.cls \clheadrule and \cvsection rule)
\newcommand{\makecvheader}{%
  \begingroup\centering
    {\Large\bfseries\color{black}\MakeUppercase{\@name}\par}%
    \smallskip
    {\small\bfseries\color{accent}\@tagline\par}%
    \smallskip
    {\footnotesize\bfseries\@personalinfo\par}%
  \endgroup
  \medskip\textcolor{accent}{\rule{\linewidth}{1.2pt}}\medskip}

% ── Dividers ──────────────────────────────────────────────────────────────────
\RequirePackage{dashrule}
\newcommand{\divider}{\medskip\textcolor{accent}{\hdashrule{\linewidth}{0.8pt}{0.5ex}}\bigskip}
\newcommand{\dividergray}{\textcolor{body!50}{\hdashrule{\linewidth}{0.4pt}{0.5ex}}\smallskip}

% ── Section header — matches cfcl.cls \clsection style ───────────────────────
% No letter-spacing (ATS fix); tight uppercase bold + 1.2pt accent rule
\newcommand{\cvsection}[1]{%
  \bigskip
  \renewcommand{\baselinestretch}{1.2}\selectfont
  {\color{accent}\small\bfseries\MakeUppercase{#1}}\\[-1ex]%
  {\color{accent}\rule{\linewidth}{1.2pt}\par}\medskip
  \renewcommand{\baselinestretch}{1.1}\selectfont}

% ── List styles ───────────────────────────────────────────────────────────────
\newcommand{\itemmarker}  {\color{accent}\small\textbullet}
\newcommand{\dashedbullets}{\color{accent}\small\textendash}

\RequirePackage{enumitem}
\setlist{leftmargin=*,labelsep=0.8em,nosep,itemsep=0.15\baselineskip,%
         after=\vskip0.15\baselineskip,before=\vskip0.15\baselineskip}
\setlist[itemize]{label=\itemmarker}

% ── Experience entry ──────────────────────────────────────────────────────────
% No letter-spacing on company or role names (ATS fix)
\newcommand{\company}[4]{%
  \smallskip
  {\large\color{body}\textbf{#1}}\hfill{\large\color{body}\textbf{#2}}\par
  {\color{accent}\faMapMarker}\hspace{0.4em}{\small\color{body}#3}\hfill
  {\color{accent}\faCalendar}\hspace{0.4em}{\small\color{body}#4}\par
  \medskip}

% ── Skill tags (visual only — do not use as sole skills record for ATS) ───────
\RequirePackage{tikz}
\newcommand{\cvtag}[1]{%
  \tikz[baseline]\node[anchor=base,draw=accent,rounded corners,inner xsep=1ex,%
    inner ysep=0.75ex,text height=1.2ex,text depth=.2ex,fill=accent]%
    {\bfseries\scriptsize\textcolor{white}{#1}};}

\NewDocumentCommand{\splitoncomma}{ >{\SplitList{,}} m }{\ProcessList{#1}{\cfcvtag}}
\NewDocumentCommand{\cfcvtag}{m}{\cvtag{#1} }

% ── Project block (consulting pattern — available but unused in default templates) ──
\newcommand{\project}[4]{%
  \bigskip
  \textbf{Project:} #1\hfill\textbf{Client:} #2\par\smallskip
  \textbf{Role(s):} #3\hfill\textbf{Technologies:} #4\par\smallskip
  \textbf{Responsibilities:}\par\smallskip}

% ── Education entry ───────────────────────────────────────────────────────────
% No letter-spacing (ATS fix)
\newcommand{\education}[4]{%
  \smallskip
  {\color{body}\textbf{#1}}\\
  {\small #2}\par
  \medskip
  {\color{accent}\locationsymbol}\hspace{0.4em}{\small #3}\par
  {\color{accent}\faCalendar}\hspace{0.4em}{\small #4}\par}

% ── Plain text skill row (ATS-safe; preferred over \cvtag for parsed fields) ──
% No letter-spacing (ATS fix)
\newcommand{\skillset}[2]{%
  \smallskip
  {\color{body}\textbf{#1}:} {\color{body}#2}\par\smallskip}

% ── Achievement row (icon + title + date + description) ───────────────────────
\RequirePackage{multirow,tabularx}
\newcommand{\cvachievement}[4]{%
  \begin{tabularx}{\linewidth}{@{}p{2em} @{\hspace{1ex}} >{\raggedright\arraybackslash}X@{}}
  \multirow{2}{*}{\Large\color{accent}#1} & \textbf{#2}\hfill{\small\color{LightGrey}#3}\\
  & #4
  \end{tabularx}%
  \smallskip}

\AtBeginDocument{%
  \pagestyle{empty}
  \color{body}
  \raggedright}
