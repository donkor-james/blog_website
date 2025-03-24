import React from 'react';
import { Mail, Phone, MapPin, Send, Users, Award, Zap, Heart, Clock, ShieldCheck } from 'lucide-react';
import Navbar from '../components/Navbar';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <Navbar />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl mb-6">
              Our Story
            </h1>
            <p className="text-xl text-indigo-100 leading-relaxed">
              WriteSpace was born from a simple idea: to create a platform where writers could find their voice, 
              connect with readers, and build meaningful communities around their ideas.
            </p>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-6">
              Our Mission
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              We're on a mission to democratize publishing and empower writers from all backgrounds to share their 
              perspectives with the world. We believe that great ideas deserve to be heard, regardless of where they come from.
            </p>
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-6">
              Our Vision
            </h2>
            <p className="text-lg text-gray-600">
              A world where authentic voices thrive, where quality content is valued and rewarded, and where 
              meaningful connections between writers and readers create communities that drive positive change.
            </p>
          </div>
          <div className="mt-12 lg:mt-0">
            <img 
              src="/api/placeholder/600/400" 
              alt="Team collaborating" 
              className="rounded-lg shadow-xl w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>

      {/* Our Values */}
      <div className="bg-white py-16 px-4 sm:px-6 lg:py-24 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Our Values
            </h2>
            <p className="mt-4 max-w-3xl mx-auto text-xl text-gray-500">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              { 
                icon: <Zap className="h-8 w-8 text-indigo-600" />, 
                title: 'Innovation', 
                description: 'We continuously explore new ways to make writing and publishing more accessible, engaging, and rewarding.'
              },
              { 
                icon: <ShieldCheck className="h-8 w-8 text-indigo-600" />, 
                title: 'Integrity', 
                description: 'We operate with honesty and transparency, creating an environment of trust for our writers and readers.'
              },
              { 
                icon: <Users className="h-8 w-8 text-indigo-600" />, 
                title: 'Community', 
                description: 'We foster meaningful connections between writers and readers, creating spaces for collaboration and growth.'
              },
              { 
                icon: <Award className="h-8 w-8 text-indigo-600" />, 
                title: 'Quality', 
                description: 'We promote and reward thoughtful, well-crafted content that educates, entertains, and inspires.'
              },
              { 
                icon: <Heart className="h-8 w-8 text-indigo-600" />, 
                title: 'Inclusivity', 
                description: 'We celebrate diverse voices and perspectives, ensuring our platform is welcoming to writers from all backgrounds.'
              },
              { 
                icon: <Clock className="h-8 w-8 text-indigo-600" />, 
                title: 'Long-term Thinking', 
                description: 'We build for sustainability, making decisions that support our community and company for years to come.'
              }
            ].map((value, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Meet Our Team
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-xl text-gray-500">
            The passionate people behind WriteSpace
          </p>
        </div>
        <div className="grid gap-12 md:grid-cols-3">
          {[
            {
              name: 'Sarah Chen',
              role: 'Founder & CEO',
              bio: 'Former journalist with a passion for storytelling and technology. Sarah founded WriteSpace to create the platform she always wished existed.',
              image: '/api/placeholder/400/400'
            },
            {
              name: 'Michael Torres',
              role: 'CTO',
              bio: 'Tech innovator with 15+ years experience building scalable platforms. Michael leads our engineering team with a focus on user experience.',
              image: '/api/placeholder/400/400'
            },
            {
              name: 'Amara Patel',
              role: 'Head of Community',
              bio: 'Community builder and writer who believes in the power of connection. Amara ensures WriteSpace remains a vibrant, supportive community.',
              image: '/api/placeholder/400/400'
            }
          ].map((member, index) => (
            <div key={index} className="text-center">
              <div className="mb-6">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="mx-auto h-40 w-40 rounded-full object-cover shadow-lg"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
              <p className="text-indigo-600 font-medium mb-3">{member.role}</p>
              <p className="text-gray-600">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-6">
                Get in Touch
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Have questions, feedback, or just want to say hello? We'd love to hear from you. 
                Fill out the form or use one of our contact methods below.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="h-6 w-6 text-indigo-600 mr-3" />
                  <span className="text-gray-600">support@writespace.com</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-6 w-6 text-indigo-600 mr-3" />
                  <span className="text-gray-600">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-6 w-6 text-indigo-600 mr-3" />
                  <span className="text-gray-600">123 Writer's Lane, San Francisco, CA 94103</span>
                </div>
              </div>
            </div>
            <div className="mt-12 lg:mt-0">
              <form className="bg-white shadow-md rounded-lg p-8">
                <div className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Name
                    </label>
                    <input 
                      type="text" 
                      id="name" 
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input 
                      type="email" 
                      id="email" 
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                      Subject
                    </label>
                    <input 
                      type="text" 
                      id="subject" 
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="How can we help you?"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <textarea 
                      id="message" 
                      rows="4" 
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Your message here..."
                    ></textarea>
                  </div>
                  <div>
                    <button 
                      type="submit" 
                      className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 flex items-center justify-center"
                    >
                      Send Message
                      <Send className="ml-2 h-4 w-4" />
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 max-w-3xl mx-auto text-xl text-gray-500">
              Find answers to common questions about WriteSpace
            </p>
          </div>
          <div className="max-w-3xl mx-auto divide-y-2 divide-gray-200">
            {[
              {
                question: 'How do I get started on WriteSpace?',
                answer: 'Sign up for a free account, complete your profile, and you can start writing immediately. Our platform offers intuitive tools for drafting, editing, and publishing your content.'
              },
              {
                question: 'Is WriteSpace free to use?',
                answer: 'Yes! WriteSpace offers a free tier that includes all essential writing and publishing tools. We also offer premium plans with advanced features for professional writers and publications.'
              },
              {
                question: 'How can I grow my audience on WriteSpace?',
                answer: 'Engage with other writers, publish consistently, use relevant tags, share your work on social media, and participate in WriteSpace communities. Our platform also offers analytics to help you understand what content resonates with your readers.'
              },
              {
                question: 'Can I monetize my content on WriteSpace?',
                answer: 'Absolutely! Once you reach a certain number of followers, you can join our Partner Program, which allows you to earn money through reader subscriptions, tips, and our ad revenue sharing program.'
              },
              {
                question: 'What type of content is allowed on WriteSpace?',
                answer: 'We welcome a wide range of content that adheres to our community guidelines. This includes articles, stories, poetry, tutorials, and more. Content that promotes hate, harassment, or violates our terms of service is not permitted.'
              }
            ].map((faq, index) => (
              <div key={index} className="py-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-indigo-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to start your writing journey?</span>
            <span className="block text-indigo-300">Join WriteSpace today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <a
                href="#"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
              >
                Sign Up
              </a>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <a
                href="#"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Learn more
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer would go here - reuse from Home page */}
    </div>
  );
};

export default About;