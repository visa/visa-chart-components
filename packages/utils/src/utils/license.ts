/**
 * Copyright (c) 2020, 2021, 2023, 2024 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
// incorporates all associated OSS License information to bundle with the application build
// licenses are provided as an array of objects for now
const licenses = [
  {
    dependency: 'visa-chart-components',
    github_link: 'https://github.com/visa/visa-chart-components',
    license: {
      type: 'MIT',
      update_date: '11/15/2020',
      link: 'https://github.com/visa/visa-chart-components/blob/master/LICENSE.md',
      text: `
        Copyright (c) Visa, Inc.

        Permission is hereby granted, free of charge, to any person obtaining a copy
        of this software and associated documentation files (the "Software"), to deal
        in the Software without restriction, including without limitation the rights
        to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
        copies of the Software, and to permit persons to whom the Software is
        furnished to do so, subject to the following conditions:
        
        The above copyright notice and this permission notice shall be included in
        all copies or substantial portions of the Software.
        
        THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
        IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
        FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
        AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
        LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
        OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
        THE SOFTWARE.
      `
    }
  },
  {
    dependency: 'node-uuid',
    github_link: 'https://github.com/kelektiv/node-uuid',
    license: {
      type: 'MIT',
      update_date: '10/15/2019',
      link: 'https://github.com/kelektiv/node-uuid/blob/master/LICENSE.md',
      text: `
        The MIT License (MIT)
 
        Copyright (c) 2010-2016 Robert Kieffer and other contributors
        
        Permission is hereby granted, free of charge, to any person obtaining a copy
        of this software and associated documentation files (the "Software"), to deal
        in the Software without restriction, including without limitation the rights
        to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
        copies of the Software, and to permit persons to whom the Software is
        furnished to do so, subject to the following conditions:
        
        The above copyright notice and this permission notice shall be included in all
        copies or substantial portions of the Software.
        
        THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
        IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
        FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
        AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
        LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
        OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
        SOFTWARE.
      `
    }
  },
  {
    dependency: 'turf.js',
    github_link: 'https://github.com/Turfjs/turf',
    license: {
      type: 'MIT',
      update_date: '8/8/2019',
      link: 'https://github.com/Turfjs/turf/blob/master/LICENSE',
      text: `
                The MIT License (MIT)

                Copyright (c) 2019 Morgan Herlocker
                
                Permission is hereby granted, free of charge, to any person obtaining a copy of
                this software and associated documentation files (the "Software"), to deal in
                the Software without restriction, including without limitation the rights to
                use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
                the Software, and to permit persons to whom the Software is furnished to do so,
                subject to the following conditions:
                
                The above copyright notice and this permission notice shall be included in all
                copies or substantial portions of the Software.
                
                THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
                IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
                FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
                COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
                IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
                CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
            `
    }
  },
  {
    dependency: 'numeral.js',
    github_link: 'https://github.com/adamwdraper/Numeral-js',
    license: {
      type: 'MIT',
      update_date: '8/8/2019',
      link: 'https://github.com/adamwdraper/Numeral-js/blob/master/LICENSE',
      text: `
                The MIT License (MIT)

                Copyright (c) 2016 Adam Draper

                Permission is hereby granted, free of charge, to any person
                obtaining a copy of this software and associated documentation
                files (the "Software"), to deal in the Software without
                restriction, including without limitation the rights to use,
                copy, modify, merge, publish, distribute, sublicense, and/or sell
                copies of the Software, and to permit persons to whom the
                Software is furnished to do so, subject to the following
                conditions:
                
                The above copyright notice and this permission notice shall be
                included in all copies or substantial portions of the Software.
                
                THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
                EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
                OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
                NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
                HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
                WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
                FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
                OTHER DEALINGS IN THE SOFTWARE.
            `
    }
  },
  {
    dependency: 'stencil.js',
    github_link: 'https://github.com/ionic-team/stencil',
    license: {
      type: 'MIT',
      update_date: '8/8/2019',
      link: 'https://github.com/ionic-team/stencil/blob/master/LICENSE',
      text: `
                The MIT License (MIT)

                Copyright (c) 2018-present Drifty Co.
                
                Permission is hereby granted, free of charge, to any person obtaining a copy
                of this software and associated documentation files (the "Software"), to deal
                in the Software without restriction, including without limitation the rights
                to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
                copies of the Software, and to permit persons to whom the Software is
                furnished to do so, subject to the following conditions:
                
                The above copyright notice and this permission notice shall be included in
                all copies or substantial portions of the Software.
                
                THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
                IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
                FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
                AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
                LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
                OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
                THE SOFTWARE.
            `
    }
  },
  {
    dependency: 'topojson.js',
    github_link: 'https://github.com/topojson/topojson',
    license: {
      type: 'BSD 3-Clause',
      update_date: '8/8/2019',
      link: 'https://github.com/topojson/topojson/blob/master/LICENSE.md',
      text: `
                Copyright (c) 2012-2016, Michael Bostock All rights reserved.

                Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
                
                Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
                
                Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
                
                The name Michael Bostock may not be used to endorse or promote products derived from this software without specific prior written permission.
                
                THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL MICHAEL BOSTOCK BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
            `
    }
  },
  {
    dependency: 'd3.js',
    github_link: 'https://github.com/d3/d3',
    license: {
      type: 'BSD 3-Clause',
      update_date: '8/8/2019',
      link: 'https://github.com/d3/d3/blob/master/LICENSE',
      text: `
                Copyright 2010-2017 Mike Bostock
                All rights reserved.
        
                Redistribution and use in source and binary forms, with or without modification,
                are permitted provided that the following conditions are met:
        
                * Redistributions of source code must retain the above copyright notice, this
                list of conditions and the following disclaimer.
        
                * Redistributions in binary form must reproduce the above copyright notice,
                this list of conditions and the following disclaimer in the documentation
                and/or other materials provided with the distribution.
        
                * Neither the name of the author nor the names of contributors may be used to
                endorse or promote products derived from this software without specific prior
                written permission.
        
                THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
                ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
                WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
                DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
                ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
                (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
                LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
                ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
                (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
                SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
            `
    }
  },
  {
    dependency: 'd3-annotation.js',
    github_link: 'https://github.com/susielu/d3-annotation',
    license: {
      type: 'Apache-2.0',
      update_date: '8/8/2019',
      link: 'https://raw.githubusercontent.com/susielu/d3-annotation/master/LICENSE',
      text: `
                            Apache License
                            Version 2.0, January 2004
                        http://www.apache.org/licenses/

                TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION

                1. Definitions.

                "License" shall mean the terms and conditions for use, reproduction,
                and distribution as defined by Sections 1 through 9 of this document.

                "Licensor" shall mean the copyright owner or entity authorized by
                the copyright owner that is granting the License.

                "Legal Entity" shall mean the union of the acting entity and all
                other entities that control, are controlled by, or are under common
                control with that entity. For the purposes of this definition,
                "control" means (i) the power, direct or indirect, to cause the
                direction or management of such entity, whether by contract or
                otherwise, or (ii) ownership of fifty percent (50%) or more of the
                outstanding shares, or (iii) beneficial ownership of such entity.

                "You" (or "Your") shall mean an individual or Legal Entity
                exercising permissions granted by this License.

                "Source" form shall mean the preferred form for making modifications,
                including but not limited to software source code, documentation
                source, and configuration files.

                "Object" form shall mean any form resulting from mechanical
                transformation or translation of a Source form, including but
                not limited to compiled object code, generated documentation,
                and conversions to other media types.

                "Work" shall mean the work of authorship, whether in Source or
                Object form, made available under the License, as indicated by a
                copyright notice that is included in or attached to the work
                (an example is provided in the Appendix below).

                "Derivative Works" shall mean any work, whether in Source or Object
                form, that is based on (or derived from) the Work and for which the
                editorial revisions, annotations, elaborations, or other modifications
                represent, as a whole, an original work of authorship. For the purposes
                of this License, Derivative Works shall not include works that remain
                separable from, or merely link (or bind by name) to the interfaces of,
                the Work and Derivative Works thereof.

                "Contribution" shall mean any work of authorship, including
                the original version of the Work and any modifications or additions
                to that Work or Derivative Works thereof, that is intentionally
                submitted to Licensor for inclusion in the Work by the copyright owner
                or by an individual or Legal Entity authorized to submit on behalf of
                the copyright owner. For the purposes of this definition, "submitted"
                means any form of electronic, verbal, or written communication sent
                to the Licensor or its representatives, including but not limited to
                communication on electronic mailing lists, source code control systems,
                and issue tracking systems that are managed by, or on behalf of, the
                Licensor for the purpose of discussing and improving the Work, but
                excluding communication that is conspicuously marked or otherwise
                designated in writing by the copyright owner as "Not a Contribution."

                "Contributor" shall mean Licensor and any individual or Legal Entity
                on behalf of whom a Contribution has been received by Licensor and
                subsequently incorporated within the Work.

                2. Grant of Copyright License. Subject to the terms and conditions of
                this License, each Contributor hereby grants to You a perpetual,
                worldwide, non-exclusive, no-charge, royalty-free, irrevocable
                copyright license to reproduce, prepare Derivative Works of,
                publicly display, publicly perform, sublicense, and distribute the
                Work and such Derivative Works in Source or Object form.

                3. Grant of Patent License. Subject to the terms and conditions of
                this License, each Contributor hereby grants to You a perpetual,
                worldwide, non-exclusive, no-charge, royalty-free, irrevocable
                (except as stated in this section) patent license to make, have made,
                use, offer to sell, sell, import, and otherwise transfer the Work,
                where such license applies only to those patent claims licensable
                by such Contributor that are necessarily infringed by their
                Contribution(s) alone or by combination of their Contribution(s)
                with the Work to which such Contribution(s) was submitted. If You
                institute patent litigation against any entity (including a
                cross-claim or counterclaim in a lawsuit) alleging that the Work
                or a Contribution incorporated within the Work constitutes direct
                or contributory patent infringement, then any patent licenses
                granted to You under this License for that Work shall terminate
                as of the date such litigation is filed.

                4. Redistribution. You may reproduce and distribute copies of the
                Work or Derivative Works thereof in any medium, with or without
                modifications, and in Source or Object form, provided that You
                meet the following conditions:

                (a) You must give any other recipients of the Work or
                Derivative Works a copy of this License; and

                (b) You must cause any modified files to carry prominent notices
                stating that You changed the files; and

                (c) You must retain, in the Source form of any Derivative Works
                that You distribute, all copyright, patent, trademark, and
                attribution notices from the Source form of the Work,
                excluding those notices that do not pertain to any part of
                the Derivative Works; and

                (d) If the Work includes a "NOTICE" text file as part of its
                distribution, then any Derivative Works that You distribute must
                include a readable copy of the attribution notices contained
                within such NOTICE file, excluding those notices that do not
                pertain to any part of the Derivative Works, in at least one
                of the following places: within a NOTICE text file distributed
                as part of the Derivative Works; within the Source form or
                documentation, if provided along with the Derivative Works; or,
                within a display generated by the Derivative Works, if and
                wherever such third-party notices normally appear. The contents
                of the NOTICE file are for informational purposes only and
                do not modify the License. You may add Your own attribution
                notices within Derivative Works that You distribute, alongside
                or as an addendum to the NOTICE text from the Work, provided
                that such additional attribution notices cannot be construed
                as modifying the License.

                You may add Your own copyright statement to Your modifications and
                may provide additional or different license terms and conditions
                for use, reproduction, or distribution of Your modifications, or
                for any such Derivative Works as a whole, provided Your use,
                reproduction, and distribution of the Work otherwise complies with
                the conditions stated in this License.

                5. Submission of Contributions. Unless You explicitly state otherwise,
                any Contribution intentionally submitted for inclusion in the Work
                by You to the Licensor shall be under the terms and conditions of
                this License, without any additional terms or conditions.
                Notwithstanding the above, nothing herein shall supersede or modify
                the terms of any separate license agreement you may have executed
                with Licensor regarding such Contributions.

                6. Trademarks. This License does not grant permission to use the trade
                names, trademarks, service marks, or product names of the Licensor,
                except as required for reasonable and customary use in describing the
                origin of the Work and reproducing the content of the NOTICE file.

                7. Disclaimer of Warranty. Unless required by applicable law or
                agreed to in writing, Licensor provides the Work (and each
                Contributor provides its Contributions) on an "AS IS" BASIS,
                WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
                implied, including, without limitation, any warranties or conditions
                of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A
                PARTICULAR PURPOSE. You are solely responsible for determining the
                appropriateness of using or redistributing the Work and assume any
                risks associated with Your exercise of permissions under this License.

                8. Limitation of Liability. In no event and under no legal theory,
                whether in tort (including negligence), contract, or otherwise,
                unless required by applicable law (such as deliberate and grossly
                negligent acts) or agreed to in writing, shall any Contributor be
                liable to You for damages, including any direct, indirect, special,
                incidental, or consequential damages of any character arising as a
                result of this License or out of the use or inability to use the
                Work (including but not limited to damages for loss of goodwill,
                work stoppage, computer failure or malfunction, or any and all
                other commercial damages or losses), even if such Contributor
                has been advised of the possibility of such damages.

                9. Accepting Warranty or Additional Liability. While redistributing
                the Work or Derivative Works thereof, You may choose to offer,
                and charge a fee for, acceptance of support, warranty, indemnity,
                or other liability obligations and/or rights consistent with this
                License. However, in accepting such obligations, You may act only
                on Your own behalf and on Your sole responsibility, not on behalf
                of any other Contributor, and only if You agree to indemnify,
                defend, and hold each Contributor harmless for any liability
                incurred by, or claims asserted against, such Contributor by reason
                of your accepting any such warranty or additional liability.

                END OF TERMS AND CONDITIONS


                APPENDIX: How to apply the Apache License to your work.

                To apply the Apache License to your work, attach the following
                boilerplate notice, with the fields enclosed by brackets "[]"
                replaced with your own identifying information. (Don't include
                the brackets!)  The text should be enclosed in the appropriate
                comment syntax for the file format. We also recommend that a
                file or class name and description of purpose be included on the
                same "printed page" as the copyright notice for easier
                identification within third-party archives.

                Copyright (c) 2017, Susie Lu

                Licensed under the Apache License, Version 2.0 (the "License");
                you may not use this file except in compliance with the License.
                You may obtain a copy of the License at

                http://www.apache.org/licenses/LICENSE-2.0

                Unless required by applicable law or agreed to in writing, software
                distributed under the License is distributed on an "AS IS" BASIS,
                WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                See the License for the specific language governing permissions and
                limitations under the License.
            `
    }
  },
  {
    dependency: 'yup',
    github_link: 'https://github.com/jquense/yup',
    license: {
      type: 'MIT',
      update_date: '12/16/2020',
      link: 'https://github.com/jquense/yup/blob/master/LICENSE.md',
      text: `
        The MIT License (MIT)

        Copyright (c) 2014 Jason Quense
        
        Permission is hereby granted, free of charge, to any person obtaining a copy
        of this software and associated documentation files (the "Software"), to deal
        in the Software without restriction, including without limitation the rights
        to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
        copies of the Software, and to permit persons to whom the Software is
        furnished to do so, subject to the following conditions:
        
        The above copyright notice and this permission notice shall be included in all
        copies or substantial portions of the Software.
        
        THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
        IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
        FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
        AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
        LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
        OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
        SOFTWARE.
      `
    }
  },
  {
    dependency: 'htmlwidgets',
    github_link: 'https://github.com/ramnathv/htmlwidgets',
    license: {
      type: 'MIT',
      update_date: '3/11/2021',
      link: 'https://github.com/ramnathv/htmlwidgets/blob/master/LICENSE',
      text: `
        MIT License

        Copyright (c) 2016, Ramnath Vaidyanathan, Joe Cheng, JJ Allaire, Yihui Xie, and Kenton Russell

        Permission is hereby granted, free of charge, to any person obtaining a copy
        of this software and associated documentation files (the "Software"), to deal
        in the Software without restriction, including without limitation the rights
        to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
        copies of the Software, and to permit persons to whom the Software is
        furnished to do so, subject to the following conditions:
        
        The above copyright notice and this permission notice shall be included in all
        copies or substantial portions of the Software.
        
        THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
        IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
        FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
        AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
        LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
        OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
        SOFTWARE.
      `
    }
  },
  {
    dependency: 'vega-label and vega-canvas',
    github_link: 'https://github.com/vega/vega-label',
    license: {
      type: 'BSD-3-Clause',
      update_date: '7/8/2021',
      link: 'https://github.com/vega/vega-label/blob/master/LICENSE',
      text: `
        Copyright (c) 2016, University of Washington Interactive Data Lab
        All rights reserved.
        
        Redistribution and use in source and binary forms, with or without
        modification, are permitted provided that the following conditions are met:
        
        1. Redistributions of source code must retain the above copyright notice, this
          list of conditions and the following disclaimer.
        
        2. Redistributions in binary form must reproduce the above copyright notice,
          this list of conditions and the following disclaimer in the documentation
          and/or other materials provided with the distribution.
        
        3. Neither the name of the copyright holder nor the names of its contributors
          may be used to endorse or promote products derived from this software
          without specific prior written permission.
        
        THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
        AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
        IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
        DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE
        FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
        DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
        SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
        CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
        OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
        OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
      `
    }
  },
  {
    dependency: 'i18Next',
    github_link: 'https://github.com/i18next/i18next',
    license: {
      type: 'MIT',
      update_date: '3/24/23',
      link: 'https://github.com/i18next/i18next/blob/master/LICENSE',
      text: `
      The MIT License (MIT)

      Copyright (c) 2022 i18next
      
      Permission is hereby granted, free of charge, to any person obtaining a copy
      of this software and associated documentation files (the "Software"), to deal
      in the Software without restriction, including without limitation the rights
      to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
      copies of the Software, and to permit persons to whom the Software is
      furnished to do so, subject to the following conditions:
      
      The above copyright notice and this permission notice shall be included in all
      copies or substantial portions of the Software.
      
      THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
      IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
      FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
      AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
      LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
      OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
      SOFTWARE.
      `
    }
  },
  {
    dependency: 'deep-keys',
    github_link: 'https://github.com/a8m/deep-keys',
    license: {
      type: 'MIT',
      update_date: '4/23/23',
      link: 'https://github.com/a8m/deep-keys/blob/master/license',
      text: `
      The MIT License (MIT)

      Copyright (c) Ariel Mashraki <ariel@mashraki.co.il> (github.com/a8m)
          
      Permission is hereby granted, free of charge, to any person obtaining a copy
      of this software and associated documentation files (the "Software"), to deal
      in the Software without restriction, including without limitation the rights
      to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
      copies of the Software, and to permit persons to whom the Software is
      furnished to do so, subject to the following conditions:
          
      The above copyright notice and this permission notice shall be included in
      all copies or substantial portions of the Software.
          
      THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
      IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
      FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
      AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
      LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
      OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
      THE SOFTWARE.
      `
    }
  }
];

export function getLicenses() {
  return licenses;
}
