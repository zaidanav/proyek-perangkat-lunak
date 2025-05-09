<template>
  <div class="min-h-screen flex flex-col pt-20" :style="{background: 'var(--primary-blue)'}">
    <!-- Header -->
    <Navbar />
    
    <!-- Hero Section -->
    <section class="relative flex-1 flex flex-col md:flex-row items-center justify-center !px-6 md:!px-12 !py-16 md:!py-24 ">
      <!-- Tennis ball decoration -->
      <div class="absolute top-10 right-10 w-32 h-32 rounded-full" :style="{ background: 'var(--primary-green)', opacity: 0.2 }"></div>
      <div class="absolute bottom-20 left-10 w-24 h-24 rounded-full" :style="{ background: 'var(--primary-green)', opacity: 0.15 }"></div>
      
      <div class="w-full md:w-1/2 text-center md:text-left !mb-8 sm:!mb-10 md:!mb-0 md:!pr-6 lg:!pr-12">
        <h2 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl !font-bold text-white leading-tight !mb-4 sm:!mb-5 md:!mb-6">
          Bandung Tennis Enthusiasts
        </h2>
        <p class="text-base sm:text-lg md:text-xl text-white/90 !mb-6 sm:!mb-7 md:!mb-8 max-w-lg mx-auto md:mx-0">
          Join the largest tennis community platform. Find matches, improve your skills, and connect with players at your level.
        </p>
        <!-- Hero Section tombol untuk user yang sudah login -->
        <!-- Hero Section tombol untuk user yang sudah login -->
        <div class="flex flex-col sm:flex-row items-center justify-center md:justify-start !space-y-4 sm:!space-y-0 sm:!space-x-4">
          <!-- Tombol Join Now hanya tampil untuk user yang belum login -->
          <router-link 
            v-if="!isLoggedIn"
            to="/register" 
            class="w-full sm:w-auto bg-[var(--primary-green)] hover:bg-[var(--green-light)] text-white border border-white/30 !px-8 !py-3 rounded-md !font-medium transition-colors"
          >
            Join Now
          </router-link>
          
          <!-- Tombol Learn More selalu tampil -->
          <a 
            href="#features" 
            class="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border border-white/30 !px-8 !py-3 rounded-md !font-medium transition-colors"
          >
            Learn More
          </a>
        </div>
      </div>
      
      <div class="w-full md:w-1/2 flex justify-center">
        <div class="relative w-full max-w-md">
          <div class="absolute inset-0 bg-[var(--primary-green)]/20 rounded-2xl transform rotate-3"></div>
          <div class="relative z-10 w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] rounded-2xl shadow-xl bg-white/10"></div>
        </div>
      </div>
    </section>
    
    <!-- Features Section -->
    <section id="features" class="bg-white !py-16 md:!py-24">
      <div class="container !mx-auto !px-6 md:!px-12">
        <div class="text-center !mb-16">
          <h2 class="text-3xl md:text-4xl !font-bold !mb-4" :style="{ color: 'var(--primary-blue)' }">Why Join Our Community?</h2>
          <p class="text-[var(--neutral-800)] max-w-2xl !mx-auto">
            BEAST Tennis Community offers everything you need to enhance your tennis experience
          </p>
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 !gap-4 sm:!gap-6 md:!gap-8">
          <!-- Feature 1 -->
          <div class="bg-[var(--neutral-200)] !p-8 rounded-xl shadow-md">
            <div class="w-16 h-16 rounded-full bg-[var(--primary-blue)]/10 flex items-center justify-center !mb-6">
              <svg class="h-8 w-8" :style="{ color: 'var(--primary-blue)' }" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <h3 class="text-xl !font-bold !mb-3" :style="{ color: 'var(--primary-blue)' }">Find Match Partners</h3>
            <p class="text-[var(--neutral-800)]">
              Connect with players at your skill level for friendly matches or competitive play.
            </p>
          </div>
          
          <!-- Feature 2 -->
          <div class="bg-[var(--neutral-200)] !p-8 rounded-xl shadow-md">
            <div class="w-16 h-16 rounded-full bg-[var(--primary-blue)]/10 flex items-center justify-center !mb-6">
              <svg class="h-8 w-8" :style="{ color: 'var(--primary-blue)' }" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-xl !font-bold !mb-3" :style="{ color: 'var(--primary-blue)' }">Track Your Progress</h3>
            <p class="text-[var(--neutral-800)]">
              Record match results, track your stats, and see your improvement over time.
            </p>
          </div>
          
          <!-- Feature 3 -->
          <div class="bg-[var(--neutral-200)] !p-8 rounded-xl shadow-md">
            <div class="w-16 h-16 rounded-full bg-[var(--primary-blue)]/10 flex items-center justify-center !mb-6">
              <svg class="h-8 w-8" :style="{ color: 'var(--primary-blue)' }" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h3 class="text-xl !font-bold !mb-3" :style="{ color: 'var(--primary-blue)' }">Join Local Events</h3>
            <p class="text-[var(--neutral-800)]">
              Discover and register for tournaments, clinics, and social events in your area.
            </p>
          </div>
          
          <!-- Feature 4 -->
          <div class="bg-[var(--neutral-200)] !p-8 rounded-xl shadow-md">
            <div class="w-16 h-16 rounded-full bg-[var(--primary-blue)]/10 flex items-center justify-center !mb-6">
              <svg class="h-8 w-8" :style="{ color: 'var(--primary-blue)' }" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h3 class="text-xl !font-bold !mb-3" :style="{ color: 'var(--primary-blue)' }">Training Videos</h3>
            <p class="text-[var(--neutral-800)]">
              Access exclusive training content from professional coaches and players.
            </p>
          </div>
          
          <!-- Feature 5 -->
          <div class="bg-[var(--neutral-200)] !p-8 rounded-xl shadow-md">
            <div class="w-16 h-16 rounded-full bg-[var(--primary-blue)]/10 flex items-center justify-center !mb-6">
              <svg class="h-8 w-8" :style="{ color: 'var(--primary-blue)' }" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
              </svg>
            </div>
            <h3 class="text-xl !font-bold !mb-3" :style="{ color: 'var(--primary-blue)' }">Community Forums</h3>
            <p class="text-[var(--neutral-800)]">
              Discuss techniques, equipment, and strategies with fellow tennis enthusiasts.
            </p>
          </div>
          
          <!-- Feature 6 -->
          <div class="bg-[var(--neutral-200)] !p-8 rounded-xl shadow-md">
            <div class="w-16 h-16 rounded-full bg-[var(--primary-blue)]/10 flex items-center justify-center !mb-6">
              <svg class="h-8 w-8" :style="{ color: 'var(--primary-blue)' }" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-xl !font-bold !mb-3" :style="{ color: 'var(--primary-blue)' }">Court Booking</h3>
            <p class="text-[var(--neutral-800)]">
              Find and reserve tennis courts near you with our integrated booking system.
            </p>
          </div>
        </div>
      </div>
    </section>
    
    <!-- About Section -->
    <section id="about" class="!py-16 md:!py-24" :style="{ background: 'linear-gradient(135deg, var(--neutral-200) 0%, var(--primary-white) 100%)' }">
      <div class="container !mx-auto !px-6 md:!px-12">
        <div class="flex flex-col md:flex-row items-center">
          <div class="w-full md:w-1/2 !mb-12 md:!mb-0">
            <div class="relative">
              <div class="absolute -top-4 -left-4 w-full h-full bg-[var(--primary-green)]/20 rounded-xl transform -rotate-3"></div>
              <div class="relative z-10 w-full h-[350px] rounded-xl shadow-xl bg-white/20"></div>
              <!-- Tennis ball decoration -->
              <div class="absolute -bottom-6 -right-6 w-16 h-16 rounded-full" :style="{ background: 'var(--primary-green)', opacity: 0.5 }"></div>
            </div>
          </div>
          
          <div class="w-full md:w-1/2 md:!pl-12">
            <h2 class="text-3xl md:text-4xl !font-bold !mb-6" :style="{ color: 'var(--primary-blue)' }">About BEAST Tennis Community</h2>
            <p class="text-[var(--neutral-800)] !mb-6">
              Founded in 2023, BEAST Tennis Community was created with a simple mission: to connect tennis players and make the sport more accessible to everyone.
            </p>
            <p class="text-[var(--neutral-800)] !mb-6">
              Our platform helps players of all skill levels find partners, improve their game, and participate in local tennis events. We believe tennis is more than just a sport—it's a community.
            </p>
            <p class="text-[var(--neutral-800)] !mb-8">
              With thousands of active members across the country, we're building the largest tennis community platform that brings players together both on and off the court.
            </p>
            
            <div class="grid grid-cols-2 !gap-6">
              <div>
                <div class="text-3xl !font-bold !mb-2" :style="{ color: 'var(--primary-blue)' }">10,000+</div>
                <p class="text-[var(--neutral-800)]">Active Members</p>
              </div>
              <div>
                <div class="text-3xl !font-bold !mb-2" :style="{ color: 'var(--primary-blue)' }">500+</div>
                <p class="text-[var(--neutral-800)]">Local Communities</p>
              </div>
              <div>
                <div class="text-3xl !font-bold !mb-2" :style="{ color: 'var(--primary-blue)' }">25,000+</div>
                <p class="text-[var(--neutral-800)]">Matches Played</p>
              </div>
              <div>
                <div class="text-3xl !font-bold !mb-2" :style="{ color: 'var(--primary-blue)' }">1,200+</div>
                <p class="text-[var(--neutral-800)]">Events Organized</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Testimonials Section -->
    <section id="community" class="bg-white !py-16 md:!py-24">
      <div class="container !mx-auto !px-6 md:!px-12">
        <div class="text-center !mb-16">
          <h2 class="text-3xl md:text-4xl !font-bold !mb-4" :style="{ color: 'var(--primary-blue)' }">What Our Community Says</h2>
          <p class="text-[var(--neutral-800)] max-w-2xl !mx-auto">
            Hear from tennis players who have found matches, improved their skills, and made new friends
          </p>
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 !gap-4 sm:!gap-6 md:!gap-8">
          <!-- Testimonial 1 -->
          <div class="bg-[var(--neutral-200)] !p-8 rounded-xl shadow-md">
            <div class="flex items-center !mb-6">
              <div class="w-12 h-12 rounded-full bg-[var(--primary-blue)] flex items-center justify-center text-white !font-bold text-xl">
                J
              </div>
              <div class="!ml-4">
                <h4 class="!font-bold" :style="{ color: 'var(--primary-blue)' }">James Wilson</h4>
                <p class="text-sm text-[var(--neutral-800)]">NTRP 4.0 Player</p>
              </div>
            </div>
            <p class="text-[var(--neutral-800)] !mb-4">
              "I moved to a new city and didn't know anyone to play tennis with. Within a week of joining BEAST, I had three regular hitting partners and joined a local league!"
            </p>
            <div class="flex text-[var(--primary-green)]">
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
            </div>
          </div>
          
          <!-- Testimonial 2 -->
          <div class="bg-[var(--neutral-200)] !p-8 rounded-xl shadow-md">
            <div class="flex items-center !mb-6">
              <div class="w-12 h-12 rounded-full bg-[var(--primary-blue)] flex items-center justify-center text-white !font-bold text-xl">
                S
              </div>
              <div class="!ml-4">
                <h4 class="!font-bold" :style="{ color: 'var(--primary-blue)' }">Sarah Johnson</h4>
                <p class="text-sm text-[var(--neutral-800)]">NTRP 3.5 Player</p>
              </div>
            </div>
            <p class="text-[var(--neutral-800)] !mb-4">
              "The training videos and tips from coaches have helped me improve my backhand significantly. I've gone from a 3.0 to a 3.5 player in just six months!"
            </p>
            <div class="flex text-[var(--primary-green)]">
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
            </div>
          </div>
          
          <!-- Testimonial 3 -->
          <div class="bg-[var(--neutral-200)] !p-8 rounded-xl shadow-md">
            <div class="flex items-center !mb-6">
              <div class="w-12 h-12 rounded-full bg-[var(--primary-blue)] flex items-center justify-center text-white !font-bold text-xl">
                M
              </div>
              <div class="!ml-4">
                <h4 class="!font-bold" :style="{ color: 'var(--primary-blue)' }">Michael Chen</h4>
                <p class="text-sm text-[var(--neutral-800)]">NTRP 4.5 Player</p>
              </div>
            </div>
            <p class="text-[var(--neutral-800)] !mb-4">
              "I've participated in three tournaments organized through BEAST. The level of competition was perfect, and I've made friends with players from all over the region."
            </p>
            <div class="flex text-[var(--primary-green)]">
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section id="contact" class="!py-10 sm:!py-12 md:!py-16 lg:!py-24" :style="{ background: 'var(--primary-blue)' }">
      <div class="container !mx-auto !px-6 md:!px-12">
        <div class="max-w-4xl !mx-auto text-center">
          <!-- Show CTA heading and buttons only for non-logged in users -->
          <template v-if="!isLoggedIn">
            <h2 class="text-3xl md:text-4xl !font-bold !mb-6 text-white">Ready to Join Our Tennis Community?</h2>
            <p class="text-white/90 !mb-8 text-lg">
              Sign up today and start connecting with tennis players in your area. Find matches, improve your skills, and become part of our growing community.
            </p>
            
            <div class="flex flex-col sm:flex-row justify-center !space-y-4 sm:!space-y-0 sm:!space-x-4">
              <router-link 
                to="/register" 
                class="bg-white text-[var(--primary-blue)] hover:bg-[var(--neutral-200)] !px-8 !py-3 rounded-md !font-medium transition-colors"
              >
                Create Account
              </router-link>
              <router-link 
                to="/login" 
                class="bg-transparent border border-white text-white hover:bg-white/10 !px-8 !py-3 rounded-md !font-medium transition-colors"
              >
                Sign In
              </router-link>
            </div>
          </template>
          
          <!-- For logged in users, show different heading -->
          <template v-else>
            <h2 class="text-3xl md:text-4xl !font-bold !mb-6 text-white">Welcome to Our Tennis Community!</h2>
            <p class="text-white/90 !mb-8 text-lg">
              Thanks for being part of our growing tennis community. Stay connected and discover new opportunities to improve your game.
            </p>
          </template>
          
          <!-- Tennis ball decoration -->
          <div class="relative !mt-16">
            <div class="absolute -top-8 right-1/4 w-16 h-16 rounded-full" :style="{ background: 'var(--primary-green)', opacity: 0.3 }"></div>
            <div class="absolute -bottom-8 left-1/4 w-20 h-20 rounded-full" :style="{ background: 'var(--primary-green)', opacity: 0.2 }"></div>
            
            <div class="bg-white/10 backdrop-blur-sm !p-8 rounded-xl">
              <h3 class="text-2xl !font-bold !mb-6 text-white">Stay Updated</h3>
              <form @submit.prevent="subscribeNewsletter" class="flex flex-col sm:flex-row !gap-4">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  class="flex-1 bg-white !px-4 !py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-green)]"
                />
                <button 
                  type="submit" 
                  class="bg-[var(--primary-green)] hover:bg-[var(--green-light)] text-white !px-6 !py-3 rounded-md !font-medium transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
        
    <!-- Footer -->
    <footer class="bg-white !py-12">
      <div class="container !mx-auto !px-4 sm:!px-6 md:!px-8 lg:!px-12">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 !gap-8">
          <div>
            <div class="flex items-center !mb-4">
              <img :src="logoImage" alt="Tennis Community Logo" class="w-10 h-auto object-contain" />
              <h3 class="text-lg !font-bold !ml-2" :style="{ color: 'var(--primary-blue)' }">BEAST</h3>
            </div>
            <p class="text-[var(--neutral-800)] !mb-4">
              Connecting tennis players and building communities across the country.
            </p>
            <div class="flex !space-x-4">
              <a href="#" class="text-[var(--primary-blue)] hover:text-[var(--blue-dark)]">
                <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path>
                </svg>
              </a>
              <a href="#" class="text-[var(--primary-blue)] hover:text-[var(--blue-dark)]">
                <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a href="#" class="text-[var(--primary-blue)] hover:text-[var(--blue-dark)]">
                <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"></path>
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h4 class="!font-bold text-lg !mb-4" :style="{ color: 'var(--primary-blue)' }">Quick Links</h4>
            <ul class="!space-y-2">
              <li><a href="#" class="text-[var(--neutral-800)] hover:text-[var(--primary-blue)]">Home</a></li>
              <li><a href="#features" class="text-[var(--neutral-800)] hover:text-[var(--primary-blue)]">Features</a></li>
              <li><a href="#about" class="text-[var(--neutral-800)] hover:text-[var(--primary-blue)]">About Us</a></li>
              <li><a href="#community" class="text-[var(--neutral-800)] hover:text-[var(--primary-blue)]">Testimonials</a></li>
              <li><a href="#contact" class="text-[var(--neutral-800)] hover:text-[var(--primary-blue)]">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h4 class="!font-bold text-lg !mb-4" :style="{ color: 'var(--primary-blue)' }">Resources</h4>
            <ul class="!space-y-2">
              <li><a href="#" class="text-[var(--neutral-800)] hover:text-[var(--primary-blue)]">Blog</a></li>
              <li><a href="#" class="text-[var(--neutral-800)] hover:text-[var(--primary-blue)]">Training Videos</a></li>
              <li><a href="#" class="text-[var(--neutral-800)] hover:text-[var(--primary-blue)]">Tournaments</a></li>
              <li><a href="#" class="text-[var(--neutral-800)] hover:text-[var(--primary-blue)]">Find Courts</a></li>
              <li><a href="#" class="text-[var(--neutral-800)] hover:text-[var(--primary-blue)]">Community Forums</a></li>
            </ul>
          </div>
          
          <div>
            <h4 class="!font-bold text-lg !mb-4" :style="{ color: 'var(--primary-blue)' }">Contact Us</h4>
            <ul class="!space-y-2">
              <li class="flex items-start">
                <svg class="h-6 w-6 !mr-2 text-[var(--primary-blue)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                <span class="text-[var(--neutral-800)]">support@beasttenniscommunity.com</span>
              </li>
              <li class="flex items-start">
                <svg class="h-6 w-6 !mr-2 text-[var(--primary-blue)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
                <span class="text-[var(--neutral-800)]">(123) 456-7890</span>
              </li>
            </ul>
          </div>
        </div>
        
        <!-- Tennis court decoration at bottom -->
        <div class="h-2 !mt-12" :style="{ background: 'linear-gradient(90deg, var(--primary-green) 0%, var(--green-light) 100%)' }"></div>
        
        <div class="!mt-8 !pt-8 border-t border-[var(--neutral-400)] text-center text-[var(--neutral-800)]">
          <p>&copy; {{ new Date().getFullYear() }} BEAST Tennis Community. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import logoImage from '@/assets/beastLogo.png';
import { ref, onMounted} from 'vue';
import api from '@/utils/axios';
import Navbar from '@/components/Navbar.vue';

// Authentication state
const isLoggedIn = ref(false);
const userName = ref('');
const userAvatar = ref('');



// Check if user is logged in on component mount
onMounted(async () => {
  try {
    const response = await api.get('/auth/me', {
      withCredentials: true // Important for sending the auth cookie
    });
    if (response.data) {
      isLoggedIn.value = true;
      userName.value = response.data.username;
      userAvatar.value = response.data.avatar || '';
    }
  } catch{
    console.log('User not logged in');
    isLoggedIn.value = false;
  }
});

// Placeholder function for newsletter subscription
const subscribeNewsletter = () => {
  // Implement newsletter subscription logic
  console.log('Newsletter subscription submitted');
};
</script>


