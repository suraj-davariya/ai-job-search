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

\ProvidesClass{cfcv}
\LoadClass{article}
\RequirePackage[margin=2cm]{geometry}
\usepackage{microtype}
\usepackage{tcolorbox}
\usepackage{hyperref}
\RequirePackage{xcolor}

\definecolor{VividPurple}{HTML}{2E64FE}
\definecolor{SlateGrey}{HTML}{2E2E2E}
\definecolor{LightGrey}{HTML}{555555}
\definecolor{AzureRadiance}{HTML}{00ABFF}
\definecolor{DodgerBlue}{HTML}{4F83FF}
\definecolor{ElectricViolet}{HTML}{9F00FF}
\definecolor{Black}{HTML}{000000}
\colorlet{accent}{DodgerBlue}
\colorlet{body}{Black!80}

\RequirePackage{fontawesome}
\newcommand{\emailsymbol}{\faAt}
\newcommand{\phonesymbol}{\faPhone}
\newcommand{\homepagesymbol}{\faChain}
\newcommand{\locationsymbol}{\faMapMarker}
\newcommand{\linkedinsymbol}{\faLinkedin}
\newcommand{\twittersymbol}{\faTwitter}
\newcommand{\githubsymbol}{\faGithub}
\newcommand{\orcidsymbol}{\textsc{orcid}} % safe fallback; use \RequirePackage{academicons} + \aiOrcid if needed
\newcommand{\mailsymbol}{\faEnvelope}
\newcommand{\devsymbol}{\faCode}
\newcommand{\linksymbol}{\faLink}
\newcommand{\certificatesymbol}{\faCertificate}

\newcommand{\printinfo}[2]{\mbox{\textcolor{accent}{#1}\hspace{0.5em}#2\hspace{2em}}}
\newcommand{\email}[1]{\printinfo{\emailsymbol}{#1}}
\newcommand{\mailaddress}[1]{\printinfo{\emailsymbol}{\href{mailto:#1}{#1}}}
\newcommand{\phone}[1]{\printinfo{\phonesymbol}{\href{tel:#1}{#1}}}
\newcommand{\homepage}[2]{\printinfo{\homepagesymbol}{\href{#2}{#1}}}
\newcommand{\twitter}[1]{\printinfo{\twittersymbol}{#1}}
\newcommand{\linkedin}[2]{\printinfo{\linkedinsymbol}{\href{#2}{#1}}}
\newcommand{\github}[2]{\printinfo{\githubsymbol}{\href{#2}{#1}}}
\newcommand{\orcid}[1]{\printinfo{\orcidsymbol}{#1}}
\newcommand{\location}[1]{\printinfo{\locationsymbol}{#1}}

\newcommand{\name}[1]{\def\@name{#1}}
\newcommand{\tagline}[1]{\def\@tagline{#1}}
\newcommand{\personalinfo}[1]{\def\@personalinfo{#1}}

\setlength{\smallskipamount}{3pt}
\setlength{\medskipamount}{4pt}
\setlength{\bigskipamount}{5pt}

\newcommand{\button}[1]{\tcbox[colback=white, colframe=accent, coltext=black,
                                  boxrule=0.5mm, arc=1mm,
                                  boxsep=4pt, left=5pt, right=5pt,
                                  top=2pt, bottom=2pt]{#1}}

\newcommand{\makecvheader}{%
  \begingroup \center
    {\Large\bfseries\color{black}\textls[250]{\@name}\par}
    \smallskip
    {\normalsize\bfseries\color{accent}\textls[340]{\MakeUppercase{\@tagline}}\par}
    \smallskip
    {\center\footnotesize\bfseries\@personalinfo\par}
  \endgroup\smallskip}

\RequirePackage{dashrule}
\setlength{\parindent}{0pt}
\newcommand{\divider}{\medskip\textcolor{accent}{\hdashrule{\linewidth}{0.8pt}{0.5ex}}\bigskip}
\newcommand{\dividergray}{\textcolor{body!50}{\hdashrule{\linewidth}{0.4pt}{0.5ex}}\smallskip}

\newcommand{\cvsection}[1]{%
  \bigskip%
  \renewcommand{\baselinestretch}{1.2}\selectfont
  {\color{accent}\small\bfseries\textls[250]{\MakeUppercase{#1}}}\\[-1ex]%
  {\color{accent}\rule{\linewidth}{1.2pt}\par}\medskip
  \renewcommand{\baselinestretch}{1.1}\selectfont}

\newcommand{\itemmarker}{\color{accent}\small\textbullet}
\newcommand{\dashedbullets}{\color{accent}\small\textendash}

\RequirePackage{enumitem}
\setlist{leftmargin=*,labelsep=0.8em,nosep,itemsep=0.15\baselineskip,%
         after=\vskip0.15\baselineskip,before=\vskip0.15\baselineskip}
\setlist[itemize]{label=\itemmarker}

\newcommand{\company}[4]{%
    \smallskip
    {\large\color{body}\textls[140]{\textbf{#1}}} \hfill
    {\large\color{body}\textls[100]{\textbf{#2}}} \par
    {\color{accent}\faMapMarker} \hspace{0.5em}{\small\color{body}{#3}} \hfill
    {\color{accent}\faCalendar}  \hspace{0.5em}{\small\color{body}{#4}} \par
    \medskip}

\RequirePackage{tikz}
\newcommand{\cvtag}[1]{%
  \tikz[baseline]\node[anchor=base,draw=accent,rounded corners,inner xsep=1ex,%
    inner ysep=0.75ex,text height=1.2ex,text depth=.2ex,fill=accent]%
    {\bfseries\scriptsize\textcolor{white}{#1}};}

\NewDocumentCommand{\splitoncomma}{ >{\SplitList{,}} m }{%
  \ProcessList{#1}{\cfcvtag}}
\NewDocumentCommand{\cfcvtag}{m}{\cvtag{#1} }

\newcommand{\project}[4]{%
    \bigskip
    \textbf{Project:} #1 \hfill \textbf{Client:} #2\par\smallskip
    \textbf{Role(s):} #3 \hfill \textbf{Technologies:} {#4}\par\smallskip
    \textbf{Responsibilities:}\par\smallskip}

\newcommand{\education}[4]{%
    \smallskip
    {\color{body}\textbf{\textls[140]{{#1}}}} \\
    {\small\textls[140]{{{#2}}}} \par
    \medskip
    {{\color{accent}\locationsymbol} \hspace{0.5em} \textls[140]{#3}} \par
    {\color{accent}\faCalendar} \hspace{0.5em}{{#4}} \par}

\newcommand{\skillset}[2]{%
    \smallskip
    \color{body}{\textbf{\textls[100]{#1}}:} \color{body}{#2} \par \smallskip}

\RequirePackage{multirow,tabularx}

% Fixed from original: 4 args {icon}{title}{date}{description}
\newcommand{\cvachievement}[4]{%
  \begin{tabularx}{\linewidth}{@{}p{2em} @{\hspace{1ex}} >{\raggedright\arraybackslash}X@{}}
  \multirow{2}{*}{\Large\color{accent}#1} & \textbf{#2} \hfill {\small\color{LightGrey}#3}\\
  & #4
  \end{tabularx}%
  \smallskip}

\newcommand{\skills}[1]{%
    \smallskip
    {\small\color{body}\textls[140]{{\MakeUppercase{#1}}}} \\
    \smallskip}

\AtBeginDocument{%
  \pagestyle{empty}
  \color{body}
  \raggedright}
