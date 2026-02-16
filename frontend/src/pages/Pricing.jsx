import React from 'react'
import { PricingTable } from '@clerk/clerk-react'
import { dark } from '@clerk/themes' // Import dark theme
import NavbarComp from '../components/NavbarComp/NavbarComp.jsx'
import PriceCard from '../components/Pricing/PriceCard'

class BillingErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.warn("Clerk Billing not configured:", error);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="relative">
                     <div className="bg-amber-900/20 border border-amber-600/50 text-amber-200 px-4 py-2 rounded-lg mb-8 text-center text-sm">
                        ⚠️ <strong>Developer Mode:</strong> Clerk Billing is disabled in Dashboard. Showing mock pricing.
                    </div>
                    {/* Fallback to original Mock Pricing */}
                    <PriceCard />
                </div>
            );
        }
        return this.props.children;
    }
}

const Pricing = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-blue-500/30">
      <NavbarComp />
      
      <div className="container mx-auto pt-24 pb-12 px-4">
        <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400 mb-4">
                Enterprise-Grade Protection
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                Scalable crisis management plans for organizations of all sizes.
            </p>
        </div>

        {/* 
            CLERK PRICING TABLE WRAPPER 
            Handles "Billing Disabled" crashes gracefully.
        */}
        <div className="flex justify-center w-full">
            <div className="w-full max-w-[1200px] bg-slate-900/30 backdrop-blur-sm rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
                <BillingErrorBoundary>
                    <PricingTable 
                        mode="modal"
                        appearance={{
                            baseTheme: dark,
                            variables: {
                                colorBackground: '#0b0c15', // Deep dark background
                                colorText: 'white',
                                colorPrimary: '#f97316', // Orange-500 for accents (matching Finament)
                                colorInputBackground: '#1e293b',
                                borderRadius: '12px',
                            },
                            elements: {
                                pricingPlan: 'bg-white/5 border border-white/10 hover:border-white/20 transition-all shadow-2xl backdrop-blur-md',
                                pricingPlan__highlighted: 'bg-white/10 border-orange-500/50 shadow-orange-500/20', // Try to target highlighted plans if Clerk supports this class overlap
                                submitButton: 'bg-gradient-to-r from-orange-600 to-red-500 hover:from-orange-500 hover:to-red-400 text-white font-bold border-none shadow-lg shadow-orange-900/20',
                                headerTitle: 'text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60',
                                headerSubtitle: 'text-slate-400',
                                featuresList: 'text-slate-300'
                            }
                        }}
                    />
                </BillingErrorBoundary>
            </div>
        </div>
      </div>
    </div>
  )
}

export default Pricing
