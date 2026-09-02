<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-100">
        <div>
          <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            <div class="p-2.5 bg-primary-50 rounded-2xl text-primary-600">
              <Users class="h-7 w-7" />
            </div>
            Talent Acquisition &amp; ATS
          </h1>
          <p class="text-gray-500 text-sm mt-1">
            End-to-end recruitment management, candidate pipeline, interview schedules, and 1-click onboarding.
          </p>
        </div>
        <div class="flex items-center gap-3">
          <button
            v-if="activeTab === 'jobs'"
            @click="openJobModal()"
            class="px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all font-semibold flex items-center gap-2 shadow-sm hover:shadow"
          >
            <Plus class="h-4 w-4" />
            Post New Job
          </button>
          <button
            v-if="activeTab === 'applicants'"
            @click="openApplicantModal()"
            class="px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all font-semibold flex items-center gap-2 shadow-sm hover:shadow"
          >
            <UserPlus class="h-4 w-4" />
            Add Candidate
          </button>
          <button
            v-if="activeTab === 'interviews'"
            @click="openInterviewModal()"
            class="px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all font-semibold flex items-center gap-2 shadow-sm hover:shadow"
          >
            <CalendarPlus class="h-4 w-4" />
            Schedule Interview
          </button>
          <button
            v-if="activeTab === 'offerings'"
            @click="openOfferingModal()"
            class="px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all font-semibold flex items-center gap-2 shadow-sm hover:shadow"
          >
            <FileText class="h-4 w-4" />
            Create Offer Letter
          </button>
        </div>
      </div>

      <!-- Stats Summary -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <div class="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex items-center gap-4">
          <div class="p-3.5 bg-blue-50 text-blue-600 rounded-2xl">
            <Briefcase class="h-6 w-6" />
          </div>
          <div>
            <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Jobs</p>
            <p class="text-2xl font-black text-gray-900 mt-0.5">{{ publishedJobsCount }}</p>
          </div>
        </div>
        <div class="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex items-center gap-4">
          <div class="p-3.5 bg-indigo-50 text-indigo-600 rounded-2xl">
            <Users class="h-6 w-6" />
          </div>
          <div>
            <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Applicants</p>
            <p class="text-2xl font-black text-gray-900 mt-0.5">{{ store.applicants.length }}</p>
          </div>
        </div>
        <div class="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex items-center gap-4">
          <div class="p-3.5 bg-amber-50 text-amber-600 rounded-2xl">
            <Clock class="h-6 w-6" />
          </div>
          <div>
            <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Interviews</p>
            <p class="text-2xl font-black text-gray-900 mt-0.5">{{ upcomingInterviewsCount }}</p>
          </div>
        </div>
        <div class="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex items-center gap-4">
          <div class="p-3.5 bg-emerald-50 text-emerald-600 rounded-2xl">
            <UserCheck class="h-6 w-6" />
          </div>
          <div>
            <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Hired &amp; Onboarded</p>
            <p class="text-2xl font-black text-emerald-600 mt-0.5">{{ hiredApplicantsCount }}</p>
          </div>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="bg-gray-100/80 p-1.5 rounded-2xl flex gap-2 overflow-x-auto">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="activeTab = tab.key"
          :class="[
            'px-5 py-2.5 text-sm font-semibold rounded-xl transition-all whitespace-nowrap flex items-center gap-2',
            activeTab === tab.key
              ? 'bg-white text-gray-900 shadow-xs'
              : 'text-gray-500 hover:text-gray-900 hover:bg-white/40'
          ]"
        >
          <component :is="tab.icon" class="h-4 w-4" />
          {{ tab.name }}
          <span
            v-if="tab.badge !== undefined"
            class="ml-1 px-2 py-0.5 text-xs rounded-full font-bold"
            :class="activeTab === tab.key ? 'bg-primary-50 text-primary-700' : 'bg-gray-200 text-gray-600'"
          >
            {{ tab.badge }}
          </span>
        </button>
      </div>

      <!-- ========================================================================= -->
      <!-- TAB 1: MANAJEMEN LOWONGAN (JOB POSTS) -->
      <!-- ========================================================================= -->
      <div v-if="activeTab === 'jobs'" class="space-y-6">
        <div class="flex flex-col sm:flex-row justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <div class="relative flex-1">
            <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              v-model="jobSearch"
              type="text"
              placeholder="Search job postings by title..."
              class="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div class="flex gap-2">
            <select
              v-model="jobStatusFilter"
              class="px-4 py-2 bg-gray-50 border-none rounded-xl text-sm font-medium text-gray-700 focus:ring-2 focus:ring-primary-500 bg-white"
            >
              <option value="all">All Status</option>
              <option value="published">Published (Active)</option>
              <option value="draft">Draft</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="job in filteredJobs"
            :key="job.uuid"
            class="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col justify-between group"
          >
            <div class="space-y-4">
              <div class="flex items-center justify-between gap-2">
                <span
                  :class="[
                    'text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider',
                    job.status === 'published' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    job.status === 'draft' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                    'bg-gray-100 text-gray-600 border border-gray-200'
                  ]"
                >
                  {{ job.status }}
                </span>
                <span class="text-xs font-semibold text-gray-500 capitalize bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                  {{ job.employment_type }}
                </span>
              </div>

              <div>
                <h3 class="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">
                  {{ job.title }}
                </h3>
                <p class="text-xs font-semibold text-primary-600 mt-1 flex items-center gap-1.5">
                  <span>{{ job.department?.name || 'General Department' }}</span>
                  <span class="text-gray-300">&bull;</span>
                  <span>{{ job.designation?.title || 'Staff Role' }}</span>
                </p>
              </div>

              <div class="space-y-2.5 text-xs text-gray-600 bg-gray-50/80 p-3.5 rounded-2xl border border-gray-100">
                <div class="flex items-center gap-2">
                  <MapPin class="h-4 w-4 text-gray-400 shrink-0" />
                  <span class="truncate">{{ job.location || 'Head Office / Remote' }}</span>
                </div>
                <div class="flex items-center gap-2 font-mono text-gray-800 font-semibold">
                  <Banknote class="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>
                    {{ job.min_salary ? formatCurrency(job.min_salary) : '0' }} - {{ job.max_salary ? formatCurrency(job.max_salary) : 'Open' }}
                  </span>
                </div>
                <div v-if="job.deadline_date" class="flex items-center gap-2 text-amber-600 font-medium">
                  <Calendar class="h-4 w-4 shrink-0" />
                  <span>Deadline: {{ formatDate(job.deadline_date) }}</span>
                </div>
              </div>

              <p class="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                {{ job.description || 'No description provided.' }}
              </p>
            </div>

            <div class="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
              <span class="text-xs font-bold text-gray-600 flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-lg">
                <Users class="h-3.5 w-3.5 text-primary-600" />
                {{ job.applicants_count || 0 }} Candidates
              </span>
              <div class="flex items-center gap-1.5">
                <button
                  @click="openJobModal(job)"
                  class="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition"
                  title="Edit Job"
                >
                  <Pencil class="h-4 w-4" />
                </button>
                <button
                  @click="handleDeleteJob(job.uuid)"
                  class="p-2 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                  title="Delete Job"
                >
                  <Trash2 class="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="filteredJobs.length === 0" class="text-center py-16 bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
          <Briefcase class="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p class="text-gray-600 font-semibold text-base">No job postings found</p>
          <p class="text-gray-400 text-xs mt-1">Create your first job posting to start recruiting candidates.</p>
        </div>
      </div>

      <!-- ========================================================================= -->
      <!-- TAB 2: PELACAKAN PELAMAR (ATS KANBAN PIPELINE) -->
      <!-- ========================================================================= -->
      <div v-if="activeTab === 'applicants'" class="space-y-6">
        <!-- Filter Bar -->
        <div class="flex flex-col sm:flex-row justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <div class="relative flex-1">
            <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              v-model="applicantSearch"
              type="text"
              placeholder="Search candidate by name, email, or phone..."
              class="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div class="flex gap-2">
            <select
              v-model="selectedJobFilter"
              class="px-4 py-2 bg-gray-50 border-none rounded-xl text-sm font-medium text-gray-700 focus:ring-2 focus:ring-primary-500 bg-white"
            >
              <option value="">All Job Positions</option>
              <option v-for="j in store.jobPosts" :key="j.id" :value="j.id">{{ j.title }}</option>
            </select>
          </div>
        </div>

        <!-- ATS Kanban Columns -->
        <div class="flex gap-5 overflow-x-auto pb-6 pt-1 items-start">
          <div
            v-for="stage in atsStages"
            :key="stage.key"
            class="bg-gray-100/80 rounded-3xl p-4 flex flex-col w-[300px] shrink-0 border border-gray-200/50 shadow-2xs"
          >
            <!-- Column Header -->
            <div class="flex items-center justify-between mb-4 px-1">
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full" :class="stage.colorClass"></span>
                <span class="font-bold text-xs uppercase tracking-wider text-gray-800">{{ stage.label }}</span>
              </div>
              <span class="text-xs font-bold px-2.5 py-0.5 rounded-full bg-white text-gray-700 shadow-2xs">
                {{ getApplicantsByStage(stage.key).length }}
              </span>
            </div>

            <!-- Candidate Cards List with generous spacing -->
            <div class="space-y-4 flex-1 overflow-y-auto max-h-[72vh] pr-1">
              <div
                v-for="app in getApplicantsByStage(stage.key)"
                :key="app.uuid"
                class="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md border border-gray-100 transition-all duration-150 space-y-3.5 group"
              >
                <div>
                  <div class="flex items-start justify-between gap-2">
                    <h4 class="font-bold text-gray-900 text-sm leading-snug group-hover:text-primary-600 transition-colors">
                      {{ app.full_name }}
                    </h4>
                    <span v-if="app.converted_employee_id" class="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-md shrink-0">
                      Onboarded
                    </span>
                  </div>
                  <p class="text-xs text-primary-600 font-semibold mt-0.5 line-clamp-1">
                    {{ app.job_post?.title || 'General Applicant' }}
                  </p>
                </div>

                <div class="text-[11px] text-gray-500 space-y-1.5 bg-gray-50/70 p-2.5 rounded-xl border border-gray-100/60">
                  <p class="truncate flex items-center gap-1.5">
                    <span class="text-gray-400">📧</span>
                    <span>{{ app.email }}</span>
                  </p>
                  <p v-if="app.phone" class="flex items-center gap-1.5">
                    <span class="text-gray-400">📞</span>
                    <span>{{ app.phone }}</span>
                  </p>
                  <p v-if="app.expected_salary" class="font-mono text-gray-800 font-semibold flex items-center gap-1.5">
                    <span class="text-gray-400">💰</span>
                    <span>Exp: {{ formatCurrency(app.expected_salary) }}</span>
                  </p>
                </div>

                <!-- Stage Transition Selector -->
                <div class="pt-1">
                  <select
                    :value="app.stage"
                    @change="handleStageChange(app.uuid, ($event.target as HTMLSelectElement).value)"
                    class="text-xs font-semibold py-1.5 px-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 w-full focus:ring-2 focus:ring-primary-500"
                  >
                    <option v-for="s in atsStages" :key="s.key" :value="s.key">
                      Move &rarr; {{ s.label }}
                    </option>
                  </select>
                </div>

                <!-- Quick Actions & 1-Click Onboard -->
                <div class="flex items-center justify-between pt-2 border-t border-gray-100 gap-1.5">
                  <div class="flex gap-1">
                    <button
                      @click="openInterviewModal(app)"
                      class="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg text-xs transition"
                      title="Schedule Interview"
                    >
                      <CalendarPlus class="h-4 w-4" />
                    </button>
                    <button
                      @click="openOfferingModal(app)"
                      class="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg text-xs transition"
                      title="Create Offering Letter"
                    >
                      <FileText class="h-4 w-4" />
                    </button>
                  </div>

                  <!-- 1-Click Onboard button if hired & not yet converted -->
                  <button
                    v-if="app.stage === 'hired' && !app.converted_employee_id"
                    @click="handleConvertToEmployee(app.uuid)"
                    class="px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition flex items-center gap-1 shadow-xs"
                    title="1-Click Convert to Employee"
                  >
                    <UserCheck class="h-3.5 w-3.5" />
                    Convert
                  </button>

                  <button
                    @click="handleDeleteApplicant(app.uuid)"
                    class="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg text-xs transition"
                    title="Delete Candidate"
                  >
                    <Trash2 class="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div
                v-if="getApplicantsByStage(stage.key).length === 0"
                class="text-center py-10 border-2 border-dashed border-gray-200/80 rounded-2xl text-gray-400 text-xs font-medium"
              >
                No candidates in {{ stage.label }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ========================================================================= -->
      <!-- TAB 3: JADWAL WAWANCARA (INTERVIEWS) -->
      <!-- ========================================================================= -->
      <div v-if="activeTab === 'interviews'" class="space-y-6">
        <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div class="p-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 class="font-bold text-gray-900 text-lg">Upcoming &amp; Past Interviews</h3>
              <p class="text-xs text-gray-500">Monitor interview agendas, interviewer feedback, and evaluation scores.</p>
            </div>
          </div>
          <div class="divide-y divide-gray-100">
            <div
              v-for="interview in store.interviews"
              :key="interview.uuid"
              class="p-6 flex flex-col md:flex-row md:items-center justify-between gap-5 hover:bg-gray-50/70 transition-all"
            >
              <div class="space-y-2">
                <div class="flex items-center gap-2.5">
                  <span
                    :class="[
                      'text-xs font-bold px-3 py-1 rounded-full capitalize',
                      interview.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                      interview.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                      'bg-rose-100 text-rose-700'
                    ]"
                  >
                    {{ interview.status }}
                  </span>
                  <span class="text-xs font-semibold text-gray-400 uppercase font-mono bg-gray-100 px-2 py-0.5 rounded-md">
                    {{ interview.type }}
                  </span>
                </div>
                <h4 class="font-bold text-gray-900 text-lg">{{ interview.title }}</h4>
                <p class="text-sm text-gray-600">
                  Candidate: <strong class="text-gray-900">{{ interview.applicant?.full_name }}</strong> &bull;
                  Position: <span class="text-primary-600 font-semibold">{{ interview.applicant?.job_post?.title }}</span>
                </p>
                <div class="flex flex-wrap gap-5 text-xs text-gray-600 pt-1">
                  <span class="flex items-center gap-1.5 text-gray-800 font-semibold bg-gray-100 px-2.5 py-1 rounded-lg">
                    <Clock class="h-3.5 w-3.5 text-primary-600" />
                    {{ formatDateTime(interview.scheduled_at) }}
                  </span>
                  <span v-if="interview.interviewer_name" class="flex items-center gap-1.5 bg-gray-100 px-2.5 py-1 rounded-lg">
                    <User class="h-3.5 w-3.5 text-gray-500" />
                    Interviewer: <strong>{{ interview.interviewer_name }}</strong>
                  </span>
                  <span v-if="interview.meeting_link_or_location" class="flex items-center gap-1.5 text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                    <LinkIcon class="h-3.5 w-3.5" />
                    {{ interview.meeting_link_or_location }}
                  </span>
                </div>
              </div>

              <!-- Action & Evaluation -->
              <div class="flex items-center gap-2.5">
                <button
                  @click="openEvaluationModal(interview)"
                  class="px-4 py-2.5 bg-indigo-50 text-indigo-700 font-semibold text-xs rounded-xl hover:bg-indigo-100 transition flex items-center gap-2 shadow-2xs"
                >
                  <Award class="h-4 w-4" />
                  {{ interview.evaluations?.length ? 'View / Add Evaluation' : 'Score & Feedback' }}
                </button>
                <button
                  @click="handleDeleteInterview(interview.uuid)"
                  class="p-2.5 text-rose-500 hover:bg-rose-50 rounded-xl text-xs transition"
                >
                  <Trash2 class="h-4 w-4" />
                </button>
              </div>
            </div>

            <div v-if="store.interviews.length === 0" class="text-center py-16">
              <Calendar class="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p class="text-gray-600 font-semibold">No interviews scheduled yet</p>
              <p class="text-gray-400 text-xs mt-1">Schedule interview sessions with your applicants.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- ========================================================================= -->
      <!-- TAB 4: SURAT PENAWARAN (OFFERING LETTERS) -->
      <!-- ========================================================================= -->
      <div v-if="activeTab === 'offerings'" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="offer in store.offerings"
            :key="offer.uuid"
            class="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
          >
            <div class="space-y-4">
              <div class="flex items-center justify-between gap-2">
                <span class="text-xs font-mono font-bold text-gray-400 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                  {{ offer.offer_number }}
                </span>
                <span
                  :class="[
                    'text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider',
                    offer.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' :
                    offer.status === 'rejected' ? 'bg-rose-100 text-rose-800' :
                    offer.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-700'
                  ]"
                >
                  {{ offer.status }}
                </span>
              </div>

              <div>
                <h4 class="font-bold text-gray-900 text-lg">{{ offer.applicant?.full_name }}</h4>
                <p class="text-xs text-primary-600 font-semibold mt-0.5">
                  {{ offer.applicant?.job_post?.title || 'Job Position' }}
                </p>
              </div>

              <div class="p-4 bg-gray-50 rounded-2xl space-y-2 text-xs text-gray-700 border border-gray-100">
                <div class="flex justify-between items-center">
                  <span class="text-gray-500">Basic Salary:</span>
                  <span class="font-mono text-emerald-700 font-bold text-sm">{{ formatCurrency(offer.basic_salary) }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-500">Joining Date:</span>
                  <span class="font-semibold text-gray-800">{{ formatDate(offer.joining_date) }}</span>
                </div>
                <div v-if="offer.expiry_date" class="flex justify-between items-center">
                  <span class="text-gray-500">Valid Until:</span>
                  <span class="text-amber-600 font-semibold">{{ formatDate(offer.expiry_date) }}</span>
                </div>
                <div v-if="offer.benefits" class="pt-2 border-t border-gray-200/60 text-gray-600">
                  <p class="font-semibold text-gray-700 mb-0.5">Benefits:</p>
                  <p class="text-[11px] leading-relaxed">{{ offer.benefits }}</p>
                </div>
              </div>
            </div>

            <!-- Status Control & 1-Click Convert -->
            <div class="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
              <select
                :value="offer.status"
                @change="handleOfferingStatusChange(offer.uuid, ($event.target as HTMLSelectElement).value)"
                class="text-xs font-semibold py-2 px-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 focus:ring-2 focus:ring-primary-500"
              >
                <option value="draft">Draft</option>
                <option value="sent">Sent to Candidate</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>

              <button
                v-if="offer.status === 'accepted' && !offer.applicant?.converted_employee_id"
                @click="handleConvertToEmployee(offer.applicant.uuid)"
                class="px-3.5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition flex items-center gap-1.5 shadow-sm"
              >
                <UserCheck class="h-4 w-4" />
                Convert
              </button>
            </div>
          </div>
        </div>

        <div v-if="store.offerings.length === 0" class="text-center py-16 bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
          <FileText class="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p class="text-gray-600 font-semibold">No offering letters generated yet</p>
          <p class="text-gray-400 text-xs mt-1">Generate official offer letters for qualified candidates.</p>
        </div>
      </div>

      <!-- ========================================================================= -->
      <!-- MODAL: CREATE / EDIT JOB POST -->
      <!-- ========================================================================= -->
      <Teleport to="body">
        <div v-if="showJobModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div class="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto space-y-4">
            <div class="flex items-center justify-between border-b pb-3">
              <h3 class="font-bold text-lg text-gray-900">{{ editingJobUuid ? 'Edit Job Post' : 'Post New Job Position' }}</h3>
              <button @click="showJobModal = false" class="text-gray-400 hover:text-gray-600"><X class="h-5 w-5" /></button>
            </div>
            <form @submit.prevent="saveJobPost" class="space-y-4 text-sm">
              <div>
                <label class="block font-semibold text-gray-700 mb-1">Job Title *</label>
                <input v-model="jobForm.title" type="text" required placeholder="e.g. Senior Frontend Engineer" class="w-full px-3 py-2 rounded-xl border border-gray-200" />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block font-semibold text-gray-700 mb-1">Department</label>
                  <select v-model="jobForm.department_id" class="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white">
                    <option :value="null">Select Department</option>
                    <option v-for="d in departments" :key="d.id" :value="d.id">{{ d.name }}</option>
                  </select>
                </div>
                <div>
                  <label class="block font-semibold text-gray-700 mb-1">Employment Type</label>
                  <select v-model="jobForm.employment_type" class="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white">
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block font-semibold text-gray-700 mb-1">Min Salary (IDR)</label>
                  <input v-model.number="jobForm.min_salary" type="number" placeholder="e.g. 10000000" class="w-full px-3 py-2 rounded-xl border border-gray-200" />
                </div>
                <div>
                  <label class="block font-semibold text-gray-700 mb-1">Max Salary (IDR)</label>
                  <input v-model.number="jobForm.max_salary" type="number" placeholder="e.g. 15000000" class="w-full px-3 py-2 rounded-xl border border-gray-200" />
                </div>
              </div>
              <div>
                <label class="block font-semibold text-gray-700 mb-1">Location</label>
                <input v-model="jobForm.location" type="text" placeholder="e.g. Jakarta / Remote" class="w-full px-3 py-2 rounded-xl border border-gray-200" />
              </div>
              <div>
                <label class="block font-semibold text-gray-700 mb-1">Job Description</label>
                <textarea v-model="jobForm.description" rows="3" placeholder="Core responsibilities..." class="w-full px-3 py-2 rounded-xl border border-gray-200"></textarea>
              </div>
              <div>
                <label class="block font-semibold text-gray-700 mb-1">Requirements &amp; Qualifications</label>
                <textarea v-model="jobForm.requirements" rows="3" placeholder="Skillsets, experiences..." class="w-full px-3 py-2 rounded-xl border border-gray-200"></textarea>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block font-semibold text-gray-700 mb-1">Publish Status</label>
                  <select v-model="jobForm.status" class="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <div>
                  <label class="block font-semibold text-gray-700 mb-1">Application Deadline</label>
                  <input v-model="jobForm.deadline_date" type="date" class="w-full px-3 py-2 rounded-xl border border-gray-200" />
                </div>
              </div>
              <div class="flex justify-end gap-2 pt-3 border-t">
                <button type="button" @click="showJobModal = false" class="px-4 py-2 border rounded-xl font-semibold text-gray-600">Cancel</button>
                <button type="submit" class="px-5 py-2 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700">Save Job</button>
              </div>
            </form>
          </div>
        </div>
      </Teleport>

      <!-- ========================================================================= -->
      <!-- MODAL: ADD APPLICANT -->
      <!-- ========================================================================= -->
      <Teleport to="body">
        <div v-if="showApplicantModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div class="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto space-y-4">
            <div class="flex items-center justify-between border-b pb-3">
              <h3 class="font-bold text-lg text-gray-900">Register Candidate</h3>
              <button @click="showApplicantModal = false" class="text-gray-400"><X class="h-5 w-5" /></button>
            </div>
            <form @submit.prevent="saveApplicant" class="space-y-4 text-sm">
              <div>
                <label class="block font-semibold text-gray-700 mb-1">Job Position *</label>
                <select v-model="applicantForm.job_post_id" required class="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white">
                  <option v-for="j in store.jobPosts" :key="j.id" :value="j.id">{{ j.title }}</option>
                </select>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block font-semibold text-gray-700 mb-1">First Name *</label>
                  <input v-model="applicantForm.first_name" type="text" required class="w-full px-3 py-2 rounded-xl border border-gray-200" />
                </div>
                <div>
                  <label class="block font-semibold text-gray-700 mb-1">Last Name</label>
                  <input v-model="applicantForm.last_name" type="text" class="w-full px-3 py-2 rounded-xl border border-gray-200" />
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block font-semibold text-gray-700 mb-1">Email *</label>
                  <input v-model="applicantForm.email" type="email" required class="w-full px-3 py-2 rounded-xl border border-gray-200" />
                </div>
                <div>
                  <label class="block font-semibold text-gray-700 mb-1">Phone</label>
                  <input v-model="applicantForm.phone" type="text" class="w-full px-3 py-2 rounded-xl border border-gray-200" />
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block font-semibold text-gray-700 mb-1">Expected Salary (IDR)</label>
                  <input v-model.number="applicantForm.expected_salary" type="number" class="w-full px-3 py-2 rounded-xl border border-gray-200" />
                </div>
                <div>
                  <label class="block font-semibold text-gray-700 mb-1">Initial Stage</label>
                  <select v-model="applicantForm.stage" class="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white">
                    <option v-for="s in atsStages" :key="s.key" :value="s.key">{{ s.label }}</option>
                  </select>
                </div>
              </div>
              <div>
                <label class="block font-semibold text-gray-700 mb-1">Portfolio URL / Link</label>
                <input v-model="applicantForm.portfolio_url" type="url" placeholder="https://linkedin.com/in/..." class="w-full px-3 py-2 rounded-xl border border-gray-200" />
              </div>
              <div>
                <label class="block font-semibold text-gray-700 mb-1">Candidate Notes</label>
                <textarea v-model="applicantForm.notes" rows="2" class="w-full px-3 py-2 rounded-xl border border-gray-200"></textarea>
              </div>
              <div class="flex justify-end gap-2 pt-3 border-t">
                <button type="button" @click="showApplicantModal = false" class="px-4 py-2 border rounded-xl font-semibold text-gray-600">Cancel</button>
                <button type="submit" class="px-5 py-2 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700">Add Applicant</button>
              </div>
            </form>
          </div>
        </div>
      </Teleport>

      <!-- ========================================================================= -->
      <!-- MODAL: SCHEDULE INTERVIEW -->
      <!-- ========================================================================= -->
      <Teleport to="body">
        <div v-if="showInterviewModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div class="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <div class="flex items-center justify-between border-b pb-3">
              <h3 class="font-bold text-lg text-gray-900">Schedule Interview</h3>
              <button @click="showInterviewModal = false" class="text-gray-400"><X class="h-5 w-5" /></button>
            </div>
            <form @submit.prevent="saveInterview" class="space-y-4 text-sm">
              <div>
                <label class="block font-semibold text-gray-700 mb-1">Candidate *</label>
                <select v-model="interviewForm.job_applicant_id" required class="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white">
                  <option v-for="a in store.applicants" :key="a.id" :value="a.id">{{ a.full_name }} ({{ a.job_post?.title }})</option>
                </select>
              </div>
              <div>
                <label class="block font-semibold text-gray-700 mb-1">Interview Title *</label>
                <input v-model="interviewForm.title" type="text" required placeholder="e.g. Technical User Interview" class="w-full px-3 py-2 rounded-xl border border-gray-200" />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block font-semibold text-gray-700 mb-1">Date &amp; Time *</label>
                  <input v-model="interviewForm.scheduled_at" type="datetime-local" required class="w-full px-3 py-2 rounded-xl border border-gray-200" />
                </div>
                <div>
                  <label class="block font-semibold text-gray-700 mb-1">Type</label>
                  <select v-model="interviewForm.type" class="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white">
                    <option value="online">Online Meeting</option>
                    <option value="offline">Onsite / Office</option>
                  </select>
                </div>
              </div>
              <div>
                <label class="block font-semibold text-gray-700 mb-1">Meeting Link or Location</label>
                <input
                  v-model="interviewForm.meeting_link_or_location"
                  type="text"
                  placeholder="e.g. Google Meet URL (https://meet.google.com/...) or Room 302"
                  class="w-full px-3 py-2 rounded-xl border border-gray-200"
                />
              </div>
              <!-- Multi-Interviewer @mention Tag Input -->
              <div class="relative">
                <label class="block font-semibold text-gray-700 mb-1 flex items-center justify-between">
                  <span>Assign Interviewers (@mention Employees) *</span>
                  <span class="text-xs font-normal text-primary-600 font-semibold">{{ selectedInterviewersList.length }} Assigned</span>
                </label>

                <!-- Container with Chips & Inline @mention Input -->
                <div class="p-2.5 bg-gray-50 border border-gray-200 rounded-2xl flex flex-wrap items-center gap-2 min-h-[46px] focus-within:ring-2 focus-within:ring-primary-500 focus-within:bg-white transition-all">
                  <!-- Tagged Chips -->
                  <div
                    v-for="emp in selectedInterviewersList"
                    :key="emp.id"
                    class="flex items-center gap-1.5 py-1 px-2.5 bg-primary-100/90 text-primary-800 rounded-xl text-xs font-semibold border border-primary-200 shadow-2xs"
                  >
                    <div class="w-4 h-4 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-[9px]">
                      {{ emp.raw_name?.charAt(0) || 'E' }}
                    </div>
                    <span>@{{ emp.raw_name }}</span>
                    <button
                      type="button"
                      @click="removeTaggedInterviewer(emp.id)"
                      class="ml-0.5 text-primary-500 hover:text-primary-800 rounded-full hover:bg-primary-200/60 p-0.5"
                    >
                      <X class="h-3 w-3" />
                    </button>
                  </div>

                  <!-- Text Input inside container -->
                  <input
                    ref="interviewerInputRef"
                    v-model="interviewerSearchQuery"
                    @input="handleMentionInput"
                    @keydown="handleMentionKeydown"
                    type="text"
                    placeholder="Type @ to add interviewer..."
                    class="flex-1 min-w-[160px] bg-transparent border-none p-0 text-sm focus:ring-0 text-gray-800 placeholder:text-gray-400 font-medium"
                  />
                </div>

                <!-- Autocomplete Dropdown List -->
                <div
                  v-if="showMentionDropdown && availableMentionEmployees.length > 0"
                  class="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden max-h-56 overflow-y-auto divide-y divide-gray-50"
                >
                  <div class="p-2 bg-gray-50/80 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    Select Employee to Add as Interviewer
                  </div>
                  <button
                    type="button"
                    v-for="(emp, idx) in availableMentionEmployees"
                    :key="emp.id"
                    @click="addMentionEmployee(emp)"
                    :class="[
                      'w-full text-left p-3 flex items-center gap-3 transition-colors text-sm',
                      activeMentionIndex === idx ? 'bg-primary-50/70' : 'hover:bg-gray-50'
                    ]"
                  >
                    <div class="w-8 h-8 rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center text-xs shrink-0">
                      {{ emp.raw_name?.charAt(0) || 'E' }}
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="font-semibold text-gray-900 flex items-center gap-1.5">
                        <span>@{{ emp.raw_name }}</span>
                        <span class="text-xs text-primary-600 font-normal bg-primary-50 px-2 py-0.5 rounded-md border border-primary-100">
                          {{ emp.department || emp.designation || 'All Roles' }}
                        </span>
                      </div>
                      <p v-if="emp.email" class="text-xs text-gray-400 truncate mt-0.5">{{ emp.email }}</p>
                    </div>
                  </button>
                </div>

                <div
                  v-if="showMentionDropdown && availableMentionEmployees.length === 0"
                  class="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 p-4 text-center text-xs text-gray-400"
                >
                  No matching employees found
                </div>

                <p class="text-[11px] text-gray-400 mt-1.5">
                  💡 Ketik <strong>@</strong> untuk menambahkan lebih dari 1 interviewer (bebas role apa saja). Jadwal seluruh interviewer akan dicek agar tidak bentrok.
                </p>
              </div>
              <div class="flex justify-end gap-2 pt-3 border-t">
                <button type="button" @click="showInterviewModal = false" class="px-4 py-2 border rounded-xl font-semibold text-gray-600">Cancel</button>
                <button type="submit" class="px-5 py-2 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700">Schedule Interview</button>
              </div>
            </form>
          </div>
        </div>
      </Teleport>

      <!-- ========================================================================= -->
      <!-- MODAL: EVALUATION & FEEDBACK -->
      <!-- ========================================================================= -->
      <Teleport to="body">
        <div v-if="showEvalModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div class="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div class="flex items-center justify-between border-b pb-3">
              <h3 class="font-bold text-lg text-gray-900">Score &amp; Evaluation Feedback</h3>
              <button @click="showEvalModal = false" class="text-gray-400"><X class="h-5 w-5" /></button>
            </div>
            <form @submit.prevent="saveEvaluation" class="space-y-4 text-sm">
              <div>
                <label class="block font-semibold text-gray-700 mb-1">Evaluator Name *</label>
                <input v-model="evalForm.evaluator_name" type="text" required class="w-full px-3 py-2 rounded-xl border border-gray-200" />
              </div>
              <div class="grid grid-cols-3 gap-3">
                <div>
                  <label class="block font-semibold text-gray-700 mb-1 text-xs">Technical (1-5)</label>
                  <input v-model.number="evalForm.technical_score" type="number" min="1" max="5" required class="w-full px-3 py-2 rounded-xl border border-gray-200" />
                </div>
                <div>
                  <label class="block font-semibold text-gray-700 mb-1 text-xs">Communication (1-5)</label>
                  <input v-model.number="evalForm.communication_score" type="number" min="1" max="5" required class="w-full px-3 py-2 rounded-xl border border-gray-200" />
                </div>
                <div>
                  <label class="block font-semibold text-gray-700 mb-1 text-xs">Culture Fit (1-5)</label>
                  <input v-model.number="evalForm.culture_fit_score" type="number" min="1" max="5" required class="w-full px-3 py-2 rounded-xl border border-gray-200" />
                </div>
              </div>
              <div>
                <label class="block font-semibold text-gray-700 mb-1">Recommendation Decision *</label>
                <select v-model="evalForm.recommendation" class="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white font-semibold">
                  <option value="hire">Recommend to Hire</option>
                  <option value="consider">Consider / Need Review</option>
                  <option value="reject">Reject</option>
                </select>
              </div>
              <div>
                <label class="block font-semibold text-gray-700 mb-1">Detailed Feedback &amp; Notes</label>
                <textarea v-model="evalForm.feedback_notes" rows="3" placeholder="Key strengths, weaknesses..." class="w-full px-3 py-2 rounded-xl border border-gray-200"></textarea>
              </div>
              <div class="flex justify-end gap-2 pt-3 border-t">
                <button type="button" @click="showEvalModal = false" class="px-4 py-2 border rounded-xl font-semibold text-gray-600">Cancel</button>
                <button type="submit" class="px-5 py-2 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700">Submit Evaluation</button>
              </div>
            </form>
          </div>
        </div>
      </Teleport>

      <!-- ========================================================================= -->
      <!-- MODAL: OFFERING LETTER -->
      <!-- ========================================================================= -->
      <Teleport to="body">
        <div v-if="showOfferingModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div class="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div class="flex items-center justify-between border-b pb-3">
              <h3 class="font-bold text-lg text-gray-900">Create Offering Letter</h3>
              <button @click="showOfferingModal = false" class="text-gray-400"><X class="h-5 w-5" /></button>
            </div>
            <form @submit.prevent="saveOffering" class="space-y-4 text-sm">
              <div>
                <label class="block font-semibold text-gray-700 mb-1">Candidate *</label>
                <select v-model="offerForm.job_applicant_id" required class="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white">
                  <option v-for="a in store.applicants" :key="a.id" :value="a.id">{{ a.full_name }} ({{ a.job_post?.title }})</option>
                </select>
              </div>
              <div>
                <label class="block font-semibold text-gray-700 mb-1">Offered Basic Salary (IDR) *</label>
                <input v-model.number="offerForm.basic_salary" type="number" required placeholder="e.g. 12000000" class="w-full px-3 py-2 rounded-xl border border-gray-200" />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block font-semibold text-gray-700 mb-1">Joining / Start Date *</label>
                  <input v-model="offerForm.joining_date" type="date" required class="w-full px-3 py-2 rounded-xl border border-gray-200" />
                </div>
                <div>
                  <label class="block font-semibold text-gray-700 mb-1">Offer Expiry Date</label>
                  <input v-model="offerForm.expiry_date" type="date" class="w-full px-3 py-2 rounded-xl border border-gray-200" />
                </div>
              </div>
              <div>
                <label class="block font-semibold text-gray-700 mb-1">Benefits &amp; Allowances</label>
                <textarea v-model="offerForm.benefits" rows="2" placeholder="BPJS Kesehatan & Ketenagakerjaan, Laptop, Annual Leave 12 days" class="w-full px-3 py-2 rounded-xl border border-gray-200"></textarea>
              </div>
              <div>
                <label class="block font-semibold text-gray-700 mb-1">Status</label>
                <select v-model="offerForm.status" class="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white">
                  <option value="draft">Draft</option>
                  <option value="sent">Sent</option>
                  <option value="accepted">Accepted</option>
                </select>
              </div>
              <div class="flex justify-end gap-2 pt-3 border-t">
                <button type="button" @click="showOfferingModal = false" class="px-4 py-2 border rounded-xl font-semibold text-gray-600">Cancel</button>
                <button type="submit" class="px-5 py-2 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700">Generate Offer</button>
              </div>
            </form>
          </div>
        </div>
      </Teleport>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Swal from 'sweetalert2'
import AppLayout from '@/layouts/AppLayout.vue'
import { useRecruitmentStore } from '@/stores/recruitment'
import { departmentRepository } from '@/repositories/hrm/department.repository'
import {
  Users,
  Briefcase,
  UserPlus,
  CalendarPlus,
  FileText,
  Clock,
  UserCheck,
  Search,
  MapPin,
  Banknote,
  Calendar,
  Pencil,
  Trash2,
  User,
  Link as LinkIcon,
  Award,
  Plus,
  X
} from 'lucide-vue-next'

const store = useRecruitmentStore()
const departments = ref<any[]>([])

const activeTab = ref('jobs')
const tabs = computed(() => [
  { key: 'jobs', name: 'Job Postings', icon: Briefcase, badge: store.jobPosts.length },
  { key: 'applicants', name: 'ATS Pipeline', icon: Users, badge: store.applicants.length },
  { key: 'interviews', name: 'Interviews', icon: Clock, badge: store.interviews.length },
  { key: 'offerings', name: 'Offering Letters', icon: FileText, badge: store.offerings.length },
])

const atsStages = [
  { key: 'screening', label: 'Screening', colorClass: 'bg-blue-500' },
  { key: 'technical_test', label: 'Tech Test', colorClass: 'bg-purple-500' },
  { key: 'interview', label: 'Interview', colorClass: 'bg-amber-500' },
  { key: 'offering', label: 'Offering', colorClass: 'bg-indigo-500' },
  { key: 'hired', label: 'Hired', colorClass: 'bg-emerald-500' },
  { key: 'rejected', label: 'Rejected', colorClass: 'bg-rose-500' },
]

// Filters
const jobSearch = ref('')
const jobStatusFilter = ref('all')
const applicantSearch = ref('')
const selectedJobFilter = ref('')

const publishedJobsCount = computed(() => store.jobPosts.filter(j => j.status === 'published').length)
const upcomingInterviewsCount = computed(() => store.interviews.filter(i => i.status === 'scheduled').length)
const hiredApplicantsCount = computed(() => store.applicants.filter(a => a.stage === 'hired').length)

const filteredJobs = computed(() => {
  return store.jobPosts.filter(j => {
    const matchStatus = jobStatusFilter.value === 'all' || j.status === jobStatusFilter.value
    const matchSearch = !jobSearch.value || j.title.toLowerCase().includes(jobSearch.value.toLowerCase())
    return matchStatus && matchSearch
  })
})

function getApplicantsByStage(stageKey: string) {
  return store.applicants.filter(a => {
    const matchStage = a.stage === stageKey
    const matchJob = !selectedJobFilter.value || a.job_post_id === Number(selectedJobFilter.value)
    const matchSearch = !applicantSearch.value || a.full_name?.toLowerCase().includes(applicantSearch.value.toLowerCase())
    return matchStage && matchJob && matchSearch
  })
}

// ==========================================
// MODAL FORMS & ACTIONS
// ==========================================
// 1. Job Modal
const showJobModal = ref(false)
const editingJobUuid = ref<string | null>(null)
const jobForm = ref({
  title: '',
  department_id: null as number | null,
  designation_id: null as number | null,
  employment_type: 'full-time',
  location: '',
  min_salary: null as number | null,
  max_salary: null as number | null,
  description: '',
  requirements: '',
  benefits: '',
  status: 'published',
  deadline_date: '',
})

function openJobModal(job?: any) {
  if (job) {
    editingJobUuid.value = job.uuid
    jobForm.value = {
      title: job.title,
      department_id: job.department_id,
      designation_id: job.designation_id,
      employment_type: job.employment_type || 'full-time',
      location: job.location || '',
      min_salary: job.min_salary,
      max_salary: job.max_salary,
      description: job.description || '',
      requirements: job.requirements || '',
      benefits: job.benefits || '',
      status: job.status || 'published',
      deadline_date: job.deadline_date || '',
    }
  } else {
    editingJobUuid.value = null
    jobForm.value = {
      title: '',
      department_id: null,
      designation_id: null,
      employment_type: 'full-time',
      location: '',
      min_salary: null,
      max_salary: null,
      description: '',
      requirements: '',
      benefits: '',
      status: 'published',
      deadline_date: '',
    }
  }
  showJobModal.value = true
}

async function saveJobPost() {
  try {
    if (editingJobUuid.value) {
      await store.updateJobPost(editingJobUuid.value, jobForm.value)
    } else {
      await store.createJobPost(jobForm.value)
    }
    showJobModal.value = false
  } catch (e: any) {
    alert(e.response?.data?.message || 'Failed to save job post')
  }
}

async function handleDeleteJob(uuid: string) {
  if (confirm('Are you sure you want to delete this job posting?')) {
    await store.deleteJobPost(uuid)
  }
}

// 2. Applicant Modal
const showApplicantModal = ref(false)
const applicantForm = ref({
  job_post_id: null as number | null,
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  expected_salary: null as number | null,
  stage: 'screening',
  portfolio_url: '',
  notes: '',
})

function openApplicantModal() {
  applicantForm.value = {
    job_post_id: store.jobPosts[0]?.id || null,
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    expected_salary: null,
    stage: 'screening',
    portfolio_url: '',
    notes: '',
  }
  showApplicantModal.value = true
}

async function saveApplicant() {
  try {
    await store.createApplicant(applicantForm.value)
    showApplicantModal.value = false
  } catch (e: any) {
    alert(e.response?.data?.message || 'Failed to register applicant')
  }
}

async function handleStageChange(uuid: string, stage: string) {
  await store.updateApplicantStage(uuid, stage)
}

async function handleDeleteApplicant(uuid: string) {
  if (confirm('Delete applicant record?')) {
    await store.deleteApplicant(uuid)
  }
}

// 3. Interview Modal & Multi-Interviewer @mention Tagging
const showInterviewModal = ref(false)
const interviewerInputRef = ref<HTMLInputElement | null>(null)
const interviewerSearchQuery = ref('')
const showMentionDropdown = ref(false)
const activeMentionIndex = ref(0)
const selectedInterviewersList = ref<any[]>([])

const interviewForm = ref({
  job_applicant_id: null as number | null,
  title: '',
  scheduled_at: '',
  type: 'online',
  meeting_link_or_location: '',
  interviewer_id: null as number | null,
  interviewer_name: '',
  interviewer_email: '',
})

const availableMentionEmployees = computed(() => {
  const selectedIds = new Set(selectedInterviewersList.value.map(e => e.id))
  const query = interviewerSearchQuery.value.trim().toLowerCase().replace(/^@/, '')

  return store.interviewers.filter((emp: any) => {
    if (selectedIds.has(emp.id)) return false
    if (!query) return true
    const matchName = emp.raw_name?.toLowerCase().includes(query)
    const matchEmail = emp.email?.toLowerCase().includes(query)
    const matchDept = emp.department?.toLowerCase().includes(query) || emp.designation?.toLowerCase().includes(query)
    return matchName || matchEmail || matchDept
  })
})

function handleMentionInput(e: Event) {
  const val = interviewerSearchQuery.value
  if (val.includes('@') || val.length > 0) {
    showMentionDropdown.value = true
    activeMentionIndex.value = 0
  } else {
    showMentionDropdown.value = false
  }
}

function handleMentionKeydown(e: KeyboardEvent) {
  if (e.key === 'Backspace' && interviewerSearchQuery.value === '' && selectedInterviewersList.value.length > 0) {
    // Remove last tagged interviewer when pressing backspace on empty input
    selectedInterviewersList.value.pop()
    syncInterviewersToForm()
    return
  }

  if (!showMentionDropdown.value || availableMentionEmployees.value.length === 0) return

  if (e.key === 'ArrowDown') {
    e.preventDefault()
    activeMentionIndex.value = (activeMentionIndex.value + 1) % availableMentionEmployees.value.length
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    activeMentionIndex.value = (activeMentionIndex.value - 1 + availableMentionEmployees.value.length) % availableMentionEmployees.value.length
  } else if (e.key === 'Enter') {
    e.preventDefault()
    const selected = availableMentionEmployees.value[activeMentionIndex.value]
    if (selected) addMentionEmployee(selected)
  } else if (e.key === 'Escape') {
    showMentionDropdown.value = false
  }
}

function addMentionEmployee(emp: any) {
  if (!selectedInterviewersList.value.some(e => e.id === emp.id)) {
    selectedInterviewersList.value.push(emp)
    syncInterviewersToForm()
  }
  interviewerSearchQuery.value = ''
  showMentionDropdown.value = false
  if (interviewerInputRef.value) {
    interviewerInputRef.value.focus()
  }
}

function removeTaggedInterviewer(empId: number) {
  selectedInterviewersList.value = selectedInterviewersList.value.filter(e => e.id !== empId)
  syncInterviewersToForm()
}

function syncInterviewersToForm() {
  const names = selectedInterviewersList.value.map(e => e.raw_name || e.name).join(', ')
  const emails = selectedInterviewersList.value.map(e => e.email || '').filter(Boolean).join(', ')
  interviewForm.value.interviewer_name = names
  interviewForm.value.interviewer_email = emails
  interviewForm.value.interviewer_id = selectedInterviewersList.value[0]?.id || null
}

async function openInterviewModal(app?: any) {
  if (store.interviewers.length === 0) {
    await store.fetchInterviewers()
  }

  // Set initial tagged interviewer if available
  const defaultEmp = store.interviewers[0] || null
  if (defaultEmp) {
    selectedInterviewersList.value = [defaultEmp]
    syncInterviewersToForm()
  } else {
    selectedInterviewersList.value = []
    syncInterviewersToForm()
  }

  interviewerSearchQuery.value = ''
  showMentionDropdown.value = false

  interviewForm.value.job_applicant_id = app ? app.id : (store.applicants[0]?.id || null)
  interviewForm.value.title = app ? `Interview with ${app.full_name}` : 'HR & Technical Interview'
  interviewForm.value.scheduled_at = ''
  interviewForm.value.type = 'online'
  interviewForm.value.meeting_link_or_location = ''

  showInterviewModal.value = true
}

async function saveInterview() {
  if (selectedInterviewersList.value.length === 0 || !interviewForm.value.interviewer_name) {
    Swal.fire({
      icon: 'warning',
      title: 'Interviewer Required',
      text: 'Please tag at least 1 interviewer using @mention.',
      confirmButtonColor: '#4F46E5',
    })
    return
  }
  try {
    await store.createInterview(interviewForm.value)
    showInterviewModal.value = false
    Swal.fire({
      icon: 'success',
      title: 'Interview Scheduled',
      text: 'Interview scheduled successfully! No schedule conflict detected.',
      confirmButtonColor: '#10B981',
      timer: 3000,
      timerProgressBar: true,
    })
  } catch (e: any) {
    Swal.fire({
      icon: 'error',
      title: 'Schedule Conflict / Error',
      text: e.response?.data?.message || 'Failed to schedule interview',
      confirmButtonColor: '#EF4444',
    })
  }
}

async function handleDeleteInterview(uuid: string) {
  if (confirm('Delete scheduled interview?')) {
    await store.deleteInterview(uuid)
  }
}

// 4. Evaluation Modal
const showEvalModal = ref(false)
const evaluatingInterviewUuid = ref<string | null>(null)
const evalForm = ref({
  evaluator_name: '',
  technical_score: 4,
  communication_score: 4,
  culture_fit_score: 4,
  recommendation: 'hire',
  feedback_notes: '',
})

function openEvaluationModal(interview: any) {
  evaluatingInterviewUuid.value = interview.uuid
  evalForm.value = {
    evaluator_name: interview.interviewer_name || '',
    technical_score: 4,
    communication_score: 4,
    culture_fit_score: 4,
    recommendation: 'hire',
    feedback_notes: '',
  }
  showEvalModal.value = true
}

async function saveEvaluation() {
  if (!evaluatingInterviewUuid.value) return
  try {
    await store.submitEvaluation(evaluatingInterviewUuid.value, evalForm.value)
    showEvalModal.value = false
  } catch (e: any) {
    alert(e.response?.data?.message || 'Failed to submit evaluation')
  }
}

// 5. Offering Modal
const showOfferingModal = ref(false)
const offerForm = ref({
  job_applicant_id: null as number | null,
  basic_salary: 0,
  joining_date: '',
  expiry_date: '',
  benefits: 'BPJS Kesehatan & Ketenagakerjaan, Laptop, Annual Leave 12 days',
  status: 'sent',
})

function openOfferingModal(app?: any) {
  offerForm.value = {
    job_applicant_id: app ? app.id : (store.applicants[0]?.id || null),
    basic_salary: app?.expected_salary || 0,
    joining_date: '',
    expiry_date: '',
    benefits: 'BPJS Kesehatan & Ketenagakerjaan, Laptop, Annual Leave 12 days',
    status: 'sent',
  }
  showOfferingModal.value = true
}

async function saveOffering() {
  try {
    await store.createOffering(offerForm.value)
    showOfferingModal.value = false
  } catch (e: any) {
    alert(e.response?.data?.message || 'Failed to generate offering letter')
  }
}

async function handleOfferingStatusChange(uuid: string, status: string) {
  await store.updateOfferingStatus(uuid, status)
}

// 6. 1-Click Convert to Employee
async function handleConvertToEmployee(applicantUuid: string) {
  if (confirm('Convert candidate directly into a new official Employee record in HR database?')) {
    try {
      const res = await store.convertToEmployee(applicantUuid)
      alert(res.message || 'Candidate converted to Employee successfully!')
    } catch (e: any) {
      alert(e.response?.data?.message || 'Failed to convert candidate')
    }
  }
}

// Helpers
function formatCurrency(val: any) {
  if (!val) return 'Rp 0'
  return 'Rp ' + Number(val).toLocaleString('id-ID')
}

function formatDate(dateStr: string) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })
}

function formatDateTime(dateStr: string) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString('id-ID', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

onMounted(async () => {
  await Promise.all([
    store.fetchInterviewers(),
    store.fetchJobPosts(),
    store.fetchApplicants(),
    store.fetchInterviews(),
    store.fetchOfferings(),
  ])
  try {
    const res = await departmentRepository.getDepartments() as any
    departments.value = res.data?.data || res.data || []
  } catch (e) {
    console.error('Failed to load departments', e)
  }
})
</script>
