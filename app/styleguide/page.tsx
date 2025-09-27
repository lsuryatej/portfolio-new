import { Metadata } from 'next'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,

  ThemeToggle,
  Input,
  Textarea,
  Label
} from '@/components/ui'
import { ArrowRight } from 'lucide-react'
import { FadeIn, RiseIn, ScaleIn, SlideIn, StaggerChildren, Magnetic } from '@/lib/motion'
import { motionTokens } from '@/lib/motion/tokens'

export const metadata: Metadata = {
  title: 'Styleguide | Portfolio',
  description: 'Component library and design system documentation',
}

export default function StyleguidePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-6xl space-y-16">

        {/* Header */}
        <FadeIn>
          <div className="text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight">Design System</h1>
            <p className="text-xl text-muted-foreground">
              Component library, motion tokens, and design guidelines
            </p>
          </div>
        </FadeIn>

        {/* Typography */}
        <RiseIn delay={0.1}>
          <section>
            <h2 className="mb-8 text-3xl font-bold">Typography</h2>
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold">Heading 1</h1>
                <p className="text-sm text-muted-foreground">text-4xl font-bold</p>
              </div>
              <div>
                <h2 className="text-3xl font-bold">Heading 2</h2>
                <p className="text-sm text-muted-foreground">text-3xl font-bold</p>
              </div>
              <div>
                <h3 className="text-2xl font-semibold">Heading 3</h3>
                <p className="text-sm text-muted-foreground">text-2xl font-semibold</p>
              </div>
              <div>
                <h4 className="text-xl font-semibold">Heading 4</h4>
                <p className="text-sm text-muted-foreground">text-xl font-semibold</p>
              </div>
              <div>
                <p className="text-base">Body text - Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                <p className="text-sm text-muted-foreground">text-base</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Small text - Additional information and captions</p>
                <p className="text-xs text-muted-foreground">text-sm text-muted-foreground</p>
              </div>
            </div>
          </section>
        </RiseIn>

        {/* Colors */}
        <RiseIn delay={0.2}>
          <section>
            <h2 className="mb-8 text-3xl font-bold">Colors</h2>
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              <div className="space-y-2">
                <div className="h-16 w-full rounded-lg bg-background border"></div>
                <p className="text-sm font-medium">Background</p>
                <p className="text-xs text-muted-foreground">bg-background</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 w-full rounded-lg bg-foreground"></div>
                <p className="text-sm font-medium">Foreground</p>
                <p className="text-xs text-muted-foreground">bg-foreground</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 w-full rounded-lg bg-primary"></div>
                <p className="text-sm font-medium">Primary</p>
                <p className="text-xs text-muted-foreground">bg-primary</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 w-full rounded-lg bg-secondary"></div>
                <p className="text-sm font-medium">Secondary</p>
                <p className="text-xs text-muted-foreground">bg-secondary</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 w-full rounded-lg bg-muted"></div>
                <p className="text-sm font-medium">Muted</p>
                <p className="text-xs text-muted-foreground">bg-muted</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 w-full rounded-lg bg-accent"></div>
                <p className="text-sm font-medium">Accent</p>
                <p className="text-xs text-muted-foreground">bg-accent</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 w-full rounded-lg bg-destructive"></div>
                <p className="text-sm font-medium">Destructive</p>
                <p className="text-xs text-muted-foreground">bg-destructive</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 w-full rounded-lg border bg-card"></div>
                <p className="text-sm font-medium">Card</p>
                <p className="text-xs text-muted-foreground">bg-card</p>
              </div>
            </div>
          </section>
        </RiseIn>

        {/* Buttons */}
        <RiseIn delay={0.3}>
          <section>
            <h2 className="mb-8 text-3xl font-bold">Buttons</h2>
            <div className="space-y-6">
              <div className="flex flex-wrap gap-4">
                <Button>Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
              </div>
              <div className="flex flex-wrap gap-4">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
              </div>
              <div className="flex flex-wrap gap-4">
                <Button disabled>Disabled</Button>
                <Button variant="outline" disabled>Disabled Outline</Button>
              </div>
              <div className="flex flex-wrap gap-4">
                <Magnetic>
                  <Button>Magnetic Effect</Button>
                </Magnetic>
                <Magnetic>
                  <Button variant="outline">
                    <ArrowRight className="mr-2 h-4 w-4" />
                    With Icon
                  </Button>
                </Magnetic>
              </div>
            </div>
          </section>
        </RiseIn>

        {/* Cards */}
        <RiseIn delay={0.4}>
          <section>
            <h2 className="mb-8 text-3xl font-bold">Cards</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Card Title</CardTitle>
                  <CardDescription>Card description goes here</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Card content with some example text to show how it looks.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Interactive Card</CardTitle>
                  <CardDescription>This card has hover effects</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Hover over this card to see the subtle animation effects.</p>
                  <Button className="mt-4" size="sm">Action</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Card with Badge</CardTitle>
                  <CardDescription>
                    <Badge variant="secondary" className="mr-2">New</Badge>
                    With status indicator
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Cards can contain various UI elements and components.</p>
                </CardContent>
              </Card>
            </div>
          </section>
        </RiseIn>

        {/* Badges */}
        <RiseIn delay={0.5}>
          <section>
            <h2 className="mb-8 text-3xl font-bold">Badges</h2>
            <div className="flex flex-wrap gap-4">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="destructive">Destructive</Badge>
            </div>
          </section>
        </RiseIn>

        {/* Form Elements */}
        <RiseIn delay={0.6}>
          <section>
            <h2 className="mb-8 text-3xl font-bold">Form Elements</h2>
            <div className="max-w-md space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Enter your email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="Enter your message" />
              </div>
              <div className="flex items-center space-x-2">
                <Button>Submit</Button>
                <Button variant="outline">Cancel</Button>
              </div>
            </div>
          </section>
        </RiseIn>

        {/* Motion Primitives */}
        <RiseIn delay={0.7}>
          <section>
            <h2 className="mb-8 text-3xl font-bold">Motion Primitives</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Animation Examples</CardTitle>
                  <CardDescription>Hover or scroll to see animations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FadeIn>
                    <div className="rounded-lg bg-muted p-4">FadeIn Animation</div>
                  </FadeIn>
                  <RiseIn delay={0.1}>
                    <div className="rounded-lg bg-muted p-4">RiseIn Animation</div>
                  </RiseIn>
                  <ScaleIn delay={0.2}>
                    <div className="rounded-lg bg-muted p-4">ScaleIn Animation</div>
                  </ScaleIn>
                  <SlideIn direction="left" delay={0.3}>
                    <div className="rounded-lg bg-muted p-4">SlideIn Animation</div>
                  </SlideIn>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Staggered Animation</CardTitle>
                  <CardDescription>Children animate with staggered delays</CardDescription>
                </CardHeader>
                <CardContent>
                  <StaggerChildren stagger={0.1}>
                    <div className="mb-2 rounded-lg bg-muted p-3">Item 1</div>
                    <div className="mb-2 rounded-lg bg-muted p-3">Item 2</div>
                    <div className="mb-2 rounded-lg bg-muted p-3">Item 3</div>
                    <div className="mb-2 rounded-lg bg-muted p-3">Item 4</div>
                  </StaggerChildren>
                </CardContent>
              </Card>
            </div>
          </section>
        </RiseIn>

        {/* Motion Tokens */}
        <RiseIn delay={0.8}>
          <section>
            <h2 className="mb-8 text-3xl font-bold">Motion Tokens</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Durations</CardTitle>
                  <CardDescription>Animation timing constants</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(motionTokens.durations).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <code className="text-sm">{key}</code>
                        <span className="text-sm text-muted-foreground">{value}ms</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Easing Curves</CardTitle>
                  <CardDescription>Animation easing functions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(motionTokens.easings).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <code className="text-sm">{key}</code>
                        <span className="text-xs text-muted-foreground font-mono">
                          [{value.join(', ')}]
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>GSAP Easings</CardTitle>
                  <CardDescription>GSAP-compatible easing strings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(motionTokens.gsapEasings).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <code className="text-sm">{key}</code>
                        <span className="text-sm text-muted-foreground">{value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Spring Physics</CardTitle>
                  <CardDescription>Framer Motion spring presets</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(motionTokens.springs).map(([key, value]) => (
                      <div key={key} className="space-y-1">
                        <code className="text-sm font-medium">{key}</code>
                        <div className="text-xs text-muted-foreground">
                          stiffness: {value.stiffness}, damping: {value.damping}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </RiseIn>

        {/* Theme Toggle */}
        <RiseIn delay={0.9}>
          <section>
            <h2 className="mb-8 text-3xl font-bold">Theme System</h2>
            <Card>
              <CardHeader>
                <CardTitle>Dark/Light Mode Toggle</CardTitle>
                <CardDescription>Switch between themes to see color variations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <ThemeToggle />
                  <span className="text-sm text-muted-foreground">
                    Toggle theme to see all components in both light and dark modes
                  </span>
                </div>
              </CardContent>
            </Card>
          </section>
        </RiseIn>

        {/* Usage Guidelines */}
        <RiseIn delay={1.0}>
          <section>
            <h2 className="mb-8 text-3xl font-bold">Usage Guidelines</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Component Usage</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Import Components</h4>
                    <code className="text-sm bg-muted p-2 rounded block">
                      import {`{ Button, Card }`} from &apos;@/components/ui&apos;
                    </code>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Use Variants</h4>
                    <code className="text-sm bg-muted p-2 rounded block">
                      {`<Button variant="outline" size="lg">Click me</Button>`}
                    </code>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Motion Usage</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Import Animations</h4>
                    <code className="text-sm bg-muted p-2 rounded block">
                      import {`{ FadeIn, RiseIn }`} from &apos;@/lib/motion&apos;
                    </code>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Wrap Content</h4>
                    <code className="text-sm bg-muted p-2 rounded block">
                      {`<FadeIn delay={0.2}><div>Content</div></FadeIn>`}
                    </code>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </RiseIn>

      </div>
    </div>
  )
}