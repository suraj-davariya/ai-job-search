% cfcl.cls — CareerForge Cover Letter Class
% Visually paired with cfcv.cls: same DodgerBlue accent, Lato font, 1.2cm margins.
% Author: https://github.com/suraj-davariya
% Licence: MIT
% Compiler: xelatex (fontspec — fonts loaded from OpenFonts/fonts/ relative to CWD)
%
% IMPORTANT: Compile with xelatex from the cover_letters/ directory so that
%            fontspec Path= resolution works correctly.
%   cd cover_letters && xelatex main_example.tex

\ProvidesClass{cfcl}[2026/06/07 CareerForge Cover Letter]
\LoadClass[10pt, a4paper]{article}

\RequirePackage[left=1.2cm,right=1.2cm,top=1.2cm,bottom=1.2cm]{geometry}
\RequirePackage{fontspec}
\RequirePackage{xcolor}
\RequirePackage{microtype}
\RequirePackage{hyperref}
\RequirePackage{parskip}
\RequirePackage{tabularx}

% ── Colours (identical to cfcv.cls) ──────────────────────────────────────────
\definecolor{DodgerBlue}{HTML}{4F83FF}
\definecolor{Black}{HTML}{000000}
\definecolor{SlateGrey}{HTML}{2E2E2E}
\definecolor{LightGrey}{HTML}{555555}
\colorlet{accent}{DodgerBlue}
\colorlet{body}{Black!80}

% ── Fonts — Path= is relative to the xelatex working directory ───────────────
% Must compile from cover_letters/ for these paths to resolve.
\setmainfont[
  BoldFont       = {Lato-Bold.ttf},
  ItalicFont     = {Lato-Italic.ttf},
  BoldItalicFont = {Lato-BoldItalic.ttf},
  Path           = {OpenFonts/fonts/Lato/}
]{Lato-Regular.ttf}

\newfontfamily\FAsolid [Path=OpenFonts/fonts/FontAwesome6Free/]{fa-solid-900.ttf}
\newfontfamily\FAbrands[Path=OpenFonts/fonts/FontAwesome6Free/]{fa-brands-400.ttf}

% ── FontAwesome 6 Free icon macros ────────────────────────────────────────────
% Codepoints from FA6 Free glyph map (https://fontawesome.com/icons)
\newcommand{\faEnvelope}    {{\FAsolid \char"F0E0}}  % envelope
\newcommand{\faPhone}       {{\FAsolid \char"F095}}  % phone
\newcommand{\faLocationDot} {{\FAsolid \char"F3C5}}  % location-dot
\newcommand{\faGlobe}       {{\FAsolid \char"F0AC}}  % globe
\newcommand{\faLinkedinIn}  {{\FAbrands\char"F0E1}}  % linkedin-in
\newcommand{\faGithub}      {{\FAbrands\char"F09B}}  % github

% ── Contact item: coloured icon + small text ──────────────────────────────────
\newcommand{\citem}[2]{{\color{accent}#1}~{\small #2}}

% ── Page setup ────────────────────────────────────────────────────────────────
\pagestyle{empty}
\color{body}
\setlength{\parindent}{0pt}
\setlength{\parskip}{7pt}

% ── Header macros ─────────────────────────────────────────────────────────────
% \clname — large bold name in uppercase (matches cfcv \makecvheader rhythm)
\newcommand{\clname}[1]{%
  \begingroup\centering
    {\Large\bfseries\color{black}\MakeUppercase{#1}\par}%
  \endgroup}

% \cltagline — accent-coloured, mixed-case, no letter-spacing
\newcommand{\cltagline}[1]{%
  \begingroup\centering
    {\small\bfseries\color{accent}#1\par}%
  \endgroup}

% \primarycontact — bold row: email · phone · linkedin
\newcommand{\primarycontact}[1]{%
  \begingroup\centering{\footnotesize\bfseries #1\par}\endgroup}

% \secondarycontact — bold row: location · github · portfolio · extra links
\newcommand{\secondarycontact}[1]{%
  \begingroup\centering{\footnotesize\bfseries #1\par}\endgroup}

% \clheadrule — 1.2pt DodgerBlue rule (matches cfcv \cvsection rule)
\newcommand{\clheadrule}{%
  \medskip\textcolor{accent}{\rule{\linewidth}{1.2pt}}\medskip}

% ── Section header ────────────────────────────────────────────────────────────
% \clsection — tight uppercase bold, accent rule below (no letter-spacing)
\newcommand{\clsection}[1]{%
  \medskip
  {\color{accent}\small\bfseries\MakeUppercase{#1}}\\[-1ex]%
  {\color{accent}\rule{\linewidth}{1.2pt}}%
  \medskip}

% ── Letter-specific macros ────────────────────────────────────────────────────
% \recipient{Company}{Street address}{City, State ZIP, Country} — right-aligned
\newcommand{\recipient}[3]{%
  \begin{tabularx}{\linewidth}{@{}X r@{}}
    & {\bfseries #1}\\
    & {\small #2}\\
    & {\small\color{LightGrey}#3}
  \end{tabularx}\smallskip}

% \letterdate{Month DD, YYYY}
\newcommand{\letterdate}[1]{{\small\color{LightGrey}#1}\par}

% \opening{Dear Hiring Manager,}
\newcommand{\opening}[1]{\medskip{#1}\par}

% \closing{Sign-off sentence.}{Candidate Name}
\newcommand{\closing}[2]{\bigskip{#1}\par\vspace{20pt}{\bfseries #2}}

% ── Footer rule ───────────────────────────────────────────────────────────────
% Place \vfill\noindent\textcolor{accent}{\rule{\linewidth}{1.2pt}} at document end.
% This pushes the rule to the page bottom and matches the header rule exactly.
% (Handled in main_example.tex, not here, so the user controls placement.)
