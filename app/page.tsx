"use client"

import { useState } from "react"
import { ArrowRight, Calendar, MessageCircle, Users, CheckCircle, Phone, Mail, MapPin, X, Loader2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { sendContactEmail } from "@/app/actions"
import { useFormState } from "react-dom"
import { useFormStatus } from "react-dom"
import { useEffect } from "react"

// Form submit button with loading state
function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" className="flex-1" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Sending...
        </>
      ) : (
        "Send Message"
      )}
    </Button>
  )
}

export default function HomePage() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const [formState, formAction] = useFormState(sendContactEmail, {
    success: false,
    message: "",
    rateLimited: false,
    waitTime: 0,
  })

  // Reset form state when modal is closed
  useEffect(() => {
    if (!isContactModalOpen) {
      formState.success = false
      formState.message = ""
      formState.rateLimited = false
      formState.waitTime = 0
    }
  }, [isContactModalOpen])

  // Handle successful form submission
  useEffect(() => {
    if (formState.success) {
      // Close modal after 3 seconds on success
      const timer = setTimeout(() => {
        setIsContactModalOpen(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [formState.success])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Calendar className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Mawaad</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="#services" className="text-sm font-medium hover:text-primary transition-colors">
              Services
            </Link>
            <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">
              Features
            </Link>
            <Link href="#industries" className="text-sm font-medium hover:text-primary transition-colors">
              Industries
            </Link>
            <Link href="#contact" className="text-sm font-medium hover:text-primary transition-colors">
              Contact
            </Link>
          </nav>
          <Button onClick={() => setIsContactModalOpen(true)}>Get Started</Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            Smart Appointment Solutions
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Simplify Your Business
            <span className="text-primary block">Appointments</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Transform your appointment booking with our AI-powered smart system. Integrate WhatsApp, manage calendars,
            and delight your customers with intelligent scheduling.
          </p>
          <div className="flex justify-center">
            <Button size="lg" className="text-lg px-8" onClick={() => setIsContactModalOpen(true)}>
              Contact Us
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Mawaad's AI-Powered System?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our AI-driven smart appointment system is designed to streamline your business operations and enhance
              customer experience with intelligent automation.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <MessageCircle className="h-12 w-12 text-primary mb-4" />
                <CardTitle>WhatsApp Integration</CardTitle>
                <CardDescription>
                  Book appointments directly through WhatsApp. Your customers can schedule, reschedule, and get
                  reminders via their favorite messaging app.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Calendar className="h-12 w-12 text-primary mb-4" />
                <CardTitle>AI-Powered Calendar</CardTitle>
                <CardDescription>
                  Intelligent calendar management with AI-driven scheduling, automatic conflict detection, and smart
                  availability optimization for maximum efficiency.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Users className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Customer Management</CardTitle>
                <CardDescription>
                  Complete customer profiles, appointment history, preferences, and automated follow-ups to build
                  lasting relationships.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section id="industries" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Perfect for Every Service Business</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our appointment system adapts to your industry needs, whether you're a small local business or a growing
              enterprise.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Barber Shops", icon: "✂️", description: "Streamline haircut appointments" },
              { name: "Tattoo Studios", icon: "🎨", description: "Manage tattoo sessions" },
              { name: "Medical Clinics", icon: "🏥", description: "Patient appointment scheduling" },
              { name: "Beauty Salons", icon: "💄", description: "Beauty service bookings" },
              { name: "Fitness Centers", icon: "💪", description: "Personal training sessions" },
              { name: "Dental Offices", icon: "🦷", description: "Dental appointment management" },
              { name: "Spa & Wellness", icon: "🧘", description: "Relaxation service scheduling" },
              { name: "Pet Grooming", icon: "🐕", description: "Pet care appointments" },
            ].map((industry, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="text-4xl mb-2">{industry.icon}</div>
                  <CardTitle className="text-lg">{industry.name}</CardTitle>
                  <CardDescription>{industry.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Complete AI-Powered Appointment Solution</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage appointments efficiently with AI intelligence and keep your customers happy.
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-6">
                {[
                  "24/7 AI-powered booking via WhatsApp",
                  "Real-time calendar synchronization",
                  "AI-driven appointment reminders",
                  "Smart conflict resolution",
                  "Intelligent analytics and reporting dashboard",
                  "Multi-location support",
                  "AI-optimized staff scheduling",
                  "Payment integration",
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-lg">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center space-x-3 mb-4">
                  <MessageCircle className="h-8 w-8 text-green-500" />
                  <div>
                    <div className="font-semibold">WhatsApp Booking</div>
                    <div className="text-sm text-muted-foreground">Customer Experience</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="bg-green-100 rounded-lg p-3 text-sm">
                    Hi! I'd like to book a haircut appointment for tomorrow.
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3 text-sm">
                    Great! I have slots available at 2:00 PM and 4:30 PM. Which works better for you?
                  </div>
                  <div className="bg-green-100 rounded-lg p-3 text-sm">2:00 PM sounds perfect!</div>
                  <div className="bg-gray-100 rounded-lg p-3 text-sm">
                    ✅ Booked! Your appointment is confirmed for tomorrow at 2:00 PM. You'll receive a reminder 1 hour
                    before.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Commented out as requested */}
      {/* 
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by Businesses Worldwide</h2>
            <p className="text-xl text-muted-foreground">See what our customers say about Mawaad</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                business: "Elite Hair Studio",
                content:
                  "Mawaad transformed our booking process. WhatsApp integration made it so easy for our clients to schedule appointments. Our no-shows dropped by 60%!",
                rating: 5,
              },
              {
                name: "Dr. Ahmed Hassan",
                business: "City Medical Center",
                content:
                  "The automated reminders and easy rescheduling through WhatsApp have significantly improved our patient satisfaction scores.",
                rating: 5,
              },
              {
                name: "Mike Rodriguez",
                business: "Ink Masters Tattoo",
                content:
                  "Managing long tattoo sessions was always challenging. Mawaad's calendar system handles complex bookings perfectly.",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center space-x-1 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardDescription className="text-base">"{testimonial.content}"</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.business}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      */}

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Business?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of businesses already using Mawaad's AI-powered system to streamline their appointment
            booking and delight their customers with intelligent scheduling.
          </p>
          <div className="flex justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8" onClick={() => setIsContactModalOpen(true)}>
              Contact Us Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Get in Touch</h2>
            <p className="text-xl text-muted-foreground">Ready to get started? Contact us today!</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* <Card className="text-center">
              <CardHeader>
                <Phone className="h-8 w-8 text-primary mx-auto mb-2" />
                <CardTitle>Phone</CardTitle>
                <CardDescription>+1 (555) 123-4567</CardDescription>
              </CardHeader>
            </Card> */}
            <Card className="text-center">
              <CardHeader>
                <Mail className="h-8 w-8 text-primary mx-auto mb-2" />
                <CardTitle>Email</CardTitle>
                <CardDescription>hello@mawaad.co</CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <MapPin className="h-8 w-8 text-primary mx-auto mb-2" />
                <CardTitle>Office</CardTitle>
                <CardDescription>
                  Lebanon
                  <br />
                  Bierut, City
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">Mawaad</span>
              </div>
              <p className="text-muted-foreground">
                Smart appointment systems for modern businesses. Simplify scheduling, delight customers.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Integrations
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    API
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Status
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2025 Mawaad. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Contact Modal */}
      {isContactModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Contact Us</h2>
                <button onClick={() => setIsContactModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-6 w-6" />
                </button>
              </div>

              {formState.success ? (
                <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-md mb-4">
                  <h3 className="font-bold text-lg mb-2">Message Sent Successfully!</h3>
                  <p>Thank you for contacting us. We'll get back to you shortly.</p>
                </div>
              ) : (
                <form action={formAction} className="space-y-4">
                  {formState.message && !formState.success && (
                    <div
                      className={`p-4 rounded-md mb-4 ${
                        formState.rateLimited
                          ? "bg-yellow-50 border border-yellow-200 text-yellow-700"
                          : "bg-red-50 border border-red-200 text-red-700"
                      }`}
                    >
                      {formState.message}
                      {formState.rateLimited && formState.waitTime > 0 && (
                        <p className="mt-2 text-sm">
                          Please wait {Math.ceil(formState.waitTime / 60)} minutes before trying again.
                        </p>
                      )}
                    </div>
                  )}

                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Enter your email address"
                    />
                  </div>
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Enter your company name"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Message (Optional)
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Tell us about your business and how we can help..."
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsContactModalOpen(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <SubmitButton />
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
